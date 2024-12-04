#ifndef SERVER_HPP
#define SERVER_HPP

#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <iostream>
#include <memory>
#include <string>
#include <vector>
#include <map>
#include <mutex>
#include <atomic>

// Forward declaration of Client class
class Client;

class Server {
public:
    // Constructor and Destructor
    Server(const std::string& address, const std::string& port);
    ~Server();

    // Public methods to start and stop the server
    void start();
    void stop();

private:
    // Internal methods
    void acceptClient();
    void handleClient(std::shared_ptr<Client> client);
    void broadcast(const std::string& message,
                   const std::vector<int>& ids_to_send,
                   const std::vector<std::shared_ptr<Client>>& banned_clients);

    // Member variables
    std::string _address;
    std::string _port;

    boost::asio::io_context _io_context;
    boost::asio::ip::tcp::acceptor _acceptor;

    std::atomic<int> _client_id_counter; // Thread-safe unique client ID generator
    std::mutex map_mutex;                // Mutex for protecting _clients map
    std::map<boost::asio::ip::tcp::endpoint, std::shared_ptr<Client>> _clients;
};

#endif // SERVER_HPP
