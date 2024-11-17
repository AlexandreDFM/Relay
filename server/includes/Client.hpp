#pragma once

#include <boost/asio.hpp>
#include <iostream>
#include <map>
#include <mutex>
#include <string>
#include <thread>

using boost::asio::ip::tcp;

class Server;

class Client {
public:
    Client(std::shared_ptr<Server> serv, tcp::endpoint& edp, tcp::socket& socket);

    void handleCommand(std::string msg);
    void tryConnectClient(std::vector<std::string>);
    void send_message(std::string msg);

private:
    tcp::endpoint _endp;
    tcp::socket& _socket;
    std::shared_ptr<Server> _serv;
    bool _connected;
};

// pour broadcast: update le chat actuelle -> dans server class detection d'un ajout puis broadcast au autres
