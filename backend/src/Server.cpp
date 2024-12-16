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
            pair.second->send_message("600-" + msg);
        }
    }
}

void Server::handleNewClient(tcp::socket socket)
{
    try {
        // Upgrade the connection to a WebSocket
        websocket::stream<tcp::socket> ws{std::move(socket)};
        ws.accept();

        std::cout << "New WebSocket client connected: " << ws.next_layer().remote_endpoint() << std::endl;

        auto remote_endpoint = ws.next_layer().remote_endpoint();
        if (_listClient.find(remote_endpoint) == _listClient.end()) {
            _listClient[remote_endpoint] = std::make_shared<Client>(remote_endpoint, ws, _UserJson, _ChatsJson, _ServerJson, _ListChatJson);
        }

        // Buffer for reading WebSocket messages
        boost::beast::flat_buffer buffer;

        for (;;) {
            ws.read(buffer); // Read WebSocket message into buffer

            // Lock the map before modifying it
            {
                std::lock_guard<std::mutex> lock(map_mutex);
                std::string message = boost::beast::buffers_to_string(buffer.data());

                std::cout << "Received message: " << message << std::endl;

                // Process the message
                auto args = _listClient[remote_endpoint]->handleCommand(message);
                broadcast(std::get<2>(args), std::get<0>(args), std::get<1>(args));
            }

            // Clear the buffer for the next message
            buffer.clear();
        }
    } catch (const std::exception& e) {
        std::cerr << "Exception in WebSocket client handler thread: " << e.what() << std::endl;
    }
}
