#pragma once
#include "DataFile.hpp"

#include <boost/asio.hpp>
#include <iostream>
#include <map>
#include <mutex>
#include <string>
#include <thread>

using boost::asio::ip::tcp;
typedef std::tuple<std::vector<int>, bool, std::string> BROADCAST_ARGS;

class Client {
public:
    Client(tcp::endpoint& endp, tcp::socket& socket, std::shared_ptr<JsonFile> UserJson, std::shared_ptr<JsonFile> ChatJson, std::shared_ptr<std::vector<std::shared_ptr<JsonFile>>> ListChatJson);

    BROADCAST_ARGS handleCommand(std::string msg);
    void send_message(std::string msg);

    // Command
    void tryConnectClient(std::vector<std::string>);
    void addNewUser(std::vector<std::string> args);
    BROADCAST_ARGS sendMessageOnChat(std::vector<std::string> args);

    int _id;

private:
    tcp::endpoint _endp;
    tcp::socket& _socket;
    bool _connected;
    std::shared_ptr<JsonFile> _UserJson;
    std::shared_ptr<JsonFile> _ChatsJson;
    std::shared_ptr<std::vector<std::shared_ptr<JsonFile>>> _ListChatJson;

    std::string _name;
    std::vector<int> _listServ;
    std::vector<int> _listChats;
};

// pour broadcast: update le chat actuelle -> dans server class detection d'un ajout puis broadcast au autres
