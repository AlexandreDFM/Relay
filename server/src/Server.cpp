#include "Server.hpp"

Server::Server(int port)
    : acceptor(io_context, tcp::endpoint(tcp::v4(), port))
{
    std::cout << "Server running on port " << port << "..." << std::endl;

    _UserJson = std::make_shared<JsonFile>("../Database/User.json");

    // Launch a thread to listen for clients and process messages
    // std::thread([this]() {
    for (;;) {
        try {
            // Accept a new client connection
            tcp::socket socket(io_context);
            acceptor.accept(socket);

            // Launch a new thread to handle the client
            std::thread(&Server::handleNewClient, this, std::move(socket)).detach();
        } catch (const std::exception& e) {
            std::cerr << "Error in listener thread: " << e.what() << std::endl;
        }
    }
    // }).detach();
}

void Server::broadcast(std::string msg)
{
    for (const auto& pair : _listClient) {
        pair.second->send_message(msg);
    }
}

void Server::handleNewClient(tcp::socket socket)
{
    try {
        auto remote_endpoint = socket.remote_endpoint();
        char data[1024];

        if (_listClient.find(remote_endpoint) == _listClient.end())
            _listClient[remote_endpoint] = std::make_shared<Client>(remote_endpoint, socket, _UserJson);

        for (;;) {
            boost::system::error_code error;
            size_t length = socket.read_some(boost::asio::buffer(data), error);

            if (error == boost::asio::error::eof) {
                // Connection closed cleanly by peer
                break;
            } else if (error) {
                // Handle other errors
                throw boost::system::system_error(error);
            }

            // Lock the map before modifying it
            {
                std::lock_guard<std::mutex> lock(map_mutex);
                std::string message(data, length);

                // Store the message and sender's endpoint in the map

                _listClient[remote_endpoint]->handleCommand(message);
            }
        }
    } catch (const std::exception& e) {
        std::cerr << "Exception in client handler thread: " << e.what() << std::endl;
    }
}
