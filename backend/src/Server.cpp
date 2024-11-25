#include "Server.hpp"

Server::Server(int port)
    : acceptor(io_context, tcp::endpoint(tcp::v4(), port))
{
    std::cout << "Server running on port " << port << "..." << std::endl;

    _UserJson = std::make_shared<JsonFile>("../Database/User.json");
    _ChatsJson = std::make_shared<JsonFile>("../Database/Chats.json");
    _ServerJson = std::make_shared<JsonFile>("../Database/Servers.json");
    _ListChatJson = std::make_shared<std::vector<std::shared_ptr<JsonFile>>>();

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

void Server::broadcast(std::string msg, std::vector<int> ids, bool banned)
{
    if (msg.length() == 0)
        return;

    for (const auto& pair : _listClient) {
        bool isInVector = std::find(ids.begin(), ids.end(), pair.second->_id) != ids.end();
        std::cout << isInVector << std::endl;

        // Logic for sending the message based on the 'banned' flag and presence in the vector
        if ((banned && !isInVector) || (!banned && isInVector)) {
            pair.second->send_message(msg);
        }
    }
}

void Server::handleNewClient(tcp::socket socket)
{
    try {
        auto remote_endpoint = socket.remote_endpoint();
        char data[1024];

        if (_listClient.find(remote_endpoint) == _listClient.end())
            _listClient[remote_endpoint] = std::make_shared<Client>(remote_endpoint, socket, _UserJson, _ChatsJson, _ServerJson, _ListChatJson);

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
                auto args = _listClient[remote_endpoint]->handleCommand(message);
                broadcast(std::get<2>(args), std::get<0>(args), std::get<1>(args));
            }
        }
    } catch (const std::exception& e) {
        std::cerr << "Exception in client handler thread: " << e.what() << std::endl;
    }
}
