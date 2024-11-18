#pragma once
#include "DataFile.hpp"

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
    Client(tcp::endpoint& edp, tcp::socket& socket, std::shared_ptr<JsonFile> UserJson);

    void handleCommand(std::string msg);
    void send_message(std::string msg);

    // Command
    void tryConnectClient(std::vector<std::string>);
    void addNewUser(std::vector<std::string> args);

private : tcp::endpoint _endp;
    tcp::socket& _socket;
    bool _connected;
    std::shared_ptr<JsonFile> _UserJson;
};

// pour broadcast: update le chat actuelle -> dans server class detection d'un ajout puis broadcast au autres
