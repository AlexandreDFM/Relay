// #include "Server.hpp"
//
// Server::Server(int port)
//     : acceptor(io_context, tcp::endpoint(tcp::v4(), port))
// {
//     std::cout << "Server running on port " << port << "..." << std::endl;
//
//     // Initialize JSON files
//     _UserJson = std::make_shared<JsonFile>("../Database/User.json");
//     _ChatsJson = std::make_shared<JsonFile>("../Database/Chats.json");
//     _ServerJson = std::make_shared<JsonFile>("../Database/Servers.json");
//     _ListChatJson = std::make_shared<std::vector<std::shared_ptr<JsonFile>>>();
//
//     std::cout << "UserJson: " << (_UserJson ? "Valid" : "Null") << std::endl;
//     std::cout << "ChatsJson: " << (_ChatsJson ? "Valid" : "Null") << std::endl;
//     std::cout << "ServerJson: " << (_ServerJson ? "Valid" : "Null") << std::endl;
//     std::cout << "ListChatJson: " << (_ListChatJson ? "Valid" : "Null") << std::endl;
//
//     // Launch the listener thread
//     for (;;) {
//         try {
//             tcp::socket socket(io_context);
//             acceptor.accept(socket);  // Accept incoming connections
//
//             // Launch a new thread to handle the new client
//             std::thread(&Server::handleNewClient, this, std::move(socket)).detach();
//         } catch (const std::exception& e) {
//             std::cerr << "Error in listener thread: " << e.what() << std::endl;
//         }
//     }
// }
//
// void Server::broadcast(std::string msg, std::vector<int> ids, bool banned)
// {
//     if (msg.empty())
//         return;
//
//     // Lock the mutex to ensure thread safety when accessing _listClient
//     std::lock_guard<std::mutex> lock(map_mutex);
//
//     for (const auto& pair : _listClient) {
//         bool isInVector = std::find(ids.begin(), ids.end(), pair.second->getId()) != ids.end();
//
//         // Send message based on the 'banned' flag and presence in the vector
//         if ((banned && !isInVector) || (!banned && isInVector)) {
//             // Send message to the client
//             pair.second->send_message(msg);
//         }
//     }
// }
//
// void Server::handleNewClient(tcp::socket socket) {
//     try {
//         auto remote_endpoint = socket.remote_endpoint();
//
//         // Create WebSocket stream and perform handshake
//         boost::beast::websocket::stream<tcp::socket> ws{std::move(socket)};
//         boost::system::error_code error;
//         ws.accept(error);
//
//         if (error) {
//             std::cerr << "WebSocket handshake failed: " << error.message() << std::endl;
//             return;  // Don't add the client if handshake failed
//         }
//
//         // Check if the client is already in the list, otherwise add it
//         {
//             std::lock_guard<std::mutex> lock(map_mutex);  // Lock mutex while modifying _listClient
//             if (_listClient.find(remote_endpoint) == _listClient.end()) {
//                 _listClient[remote_endpoint] = std::make_shared<Client>(
//                     remote_endpoint,
//                     std::move(ws), // Pass WebSocket stream directly
//                     _UserJson,
//                     _ChatsJson,
//                     _ServerJson,
//                     _ListChatJson
//                 );
//             }
//         }
//
//         // Communication loop for handling messages
//         for (;;) {
//             boost::beast::flat_buffer buffer;
//             ws.read(buffer, error);
//
//             if (error == websocket::error::closed) {
//                 std::cout << "Connection closed by peer: " << remote_endpoint << std::endl;
//
//                 // Remove client from the list after disconnect
//                 {
//                     std::lock_guard<std::mutex> lock(map_mutex);  // Lock mutex while modifying _listClient
//                     _listClient.erase(remote_endpoint);  // Remove the client
//                 }
//                 break;
//             } else if (error) {
//                 std::cerr << "Error reading from client: " << error.message() << " [" << error.value() << "]" << std::endl;
//                 throw boost::system::system_error(error);
//             }
//
//             std::string message = boost::beast::buffers_to_string(buffer.data());
//
//             // Handle command and broadcast if the message is valid
//             if (!message.empty()) {
//                 std::lock_guard<std::mutex> lock(map_mutex); // Ensure thread safety when accessing _listClient
//                 auto it = _listClient.find(remote_endpoint);
//                 if (it != _listClient.end()) {
//                     // The handleCommand function processes the message and returns necessary details
//                     auto args = it->second->handleCommand(message);
//
//                     // Broadcast the message based on the results of handleCommand
//                     // Assuming handleCommand returns a tuple with (ids_to_send, banned_clients, response_message)
//                     broadcast(std::get<2>(args), std::get<0>(args), std::get<1>(args));
//                 } else {
//                     std::cerr << "Client not found in _listClient!" << std::endl;
//                 }
//             }
//         }
//     } catch (const std::exception& e) {
//         std::cerr << "Exception in client handler thread: " << e.what() << std::endl;
//     }
// }

#include "Client.hpp"
#include "Server.hpp"
#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <iostream>
#include <memory>
#include <vector>
#include <atomic>
#include <mutex>
#include <map>

namespace asio = boost::asio;
namespace beast = boost::beast;
namespace websocket = beast::websocket;

Server::Server(const std::string& address, const std::string& port)
    : _address(address), _port(port), _acceptor(_io_context), _client_id_counter(0) {
    asio::ip::tcp::endpoint endpoint(asio::ip::make_address(_address), std::stoi(_port));
    _acceptor.open(endpoint.protocol());
    _acceptor.bind(endpoint);
    _acceptor.listen();
}

Server::~Server() {
    stop();
}

void Server::start() {
    acceptClient();
    _io_context.run();
}

void Server::stop() {
    _io_context.stop();
}

void Server::acceptClient() {
    auto clientSocket = std::make_shared<asio::ip::tcp::socket>(_io_context);

    _acceptor.async_accept(*clientSocket, [this, clientSocket](boost::system::error_code ec) {
        if (!ec && clientSocket->is_open()) {
            try {
                // Generate a unique client ID
                int clientId = _client_id_counter++;

                // Create a new client and start handling messages
                auto newClient = std::make_shared<Client>(clientId, _address, _port, _io_context);
                newClient->setSocket(std::move(*clientSocket));  // Set the socket for the client

                // Lock while modifying the client list
                auto remoteEndpoint = newClient->getSocket().next_layer().remote_endpoint();
                {
                    std::lock_guard<std::mutex> lock(map_mutex);
                    _clients[remoteEndpoint] = newClient;
                }

                // Start handling the new client
                handleClient(newClient);
            } catch (const std::exception& e) {
                std::cerr << "Error handling new client: " << e.what() << std::endl;
            }
        }

        acceptClient();  // Continue accepting new clients
    });
}

void Server::handleClient(std::shared_ptr<Client> client) {
    try {
        if (client == nullptr) {
            throw std::runtime_error("Client shared_ptr is null");
        }

        if (!client->getSocket().next_layer().lowest_layer().is_open()) {
            std::cerr << "Client socket is not open, skipping handling." << std::endl;
            return;
        }

        auto remote_endpoint = client->getSocket().next_layer().lowest_layer().remote_endpoint();
        std::cout << "Client connected from " << remote_endpoint.address().to_string() << ":" << remote_endpoint.port() << std::endl;

        websocket::stream<asio::ip::tcp::socket> ws{std::move(client->getSocket())};

        boost::system::error_code error;
        ws.accept(error);  // Perform WebSocket handshake

        if (error) {
            std::cerr << "WebSocket handshake failed: " << error.message() << std::endl;
            return;
        }

        // Communication loop for handling messages
        for (;;) {
            beast::flat_buffer buffer;
            ws.read(buffer, error);

            if (error == websocket::error::closed) {
                std::cout << "Connection closed by peer: " << remote_endpoint << std::endl;

                // Remove client from the list after disconnect
                {
                    std::lock_guard<std::mutex> lock(map_mutex);
                    _clients.erase(remote_endpoint);
                }
                break;
            } else if (error) {
                std::cerr << "Error reading from client: " << error.message() << std::endl;
                throw boost::system::system_error(error);
            }

            std::string message = beast::buffers_to_string(buffer.data());

            // Handle the command and broadcast if the message is valid
            if (!message.empty()) {
                std::lock_guard<std::mutex> lock(map_mutex); // Ensure thread safety when accessing _clients
                auto it = _clients.find(remote_endpoint);
                if (it != _clients.end()) {
                    auto args = it->second->handleCommand(message);

                    // Broadcast the message based on the results of handleCommand
                    broadcast(std::get<2>(args), std::get<0>(args), std::get<1>(args));
                } else {
                    std::cerr << "Client not found in _clients!" << std::endl;
                }
            }
        }
    } catch (const std::exception& e) {
        std::cerr << "Exception in client handler: " << e.what() << std::endl;
    }
}

void Server::broadcast(const std::string& message, const std::vector<int>& ids_to_send, const std::vector<std::shared_ptr<Client>>& banned_clients) {
    for (const auto& client : _clients) {
        if (std::find(banned_clients.begin(), banned_clients.end(), client.second) == banned_clients.end()) {
            try {
                websocket::stream<asio::ip::tcp::socket>& ws = client.second->getSocket();
                ws.write(asio::buffer(message));
            } catch (const std::exception& e) {
                std::cerr << "Error broadcasting to client: " << e.what() << std::endl;
            }
        }
    }
}
