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
    Client(tcp::endpoint& endp, tcp::socket& socket, std::shared_ptr<JsonFile> UserJson, std::shared_ptr<JsonFile> ChatJson, std::shared_ptr<JsonFile> ServerJson, std::shared_ptr<std::vector<std::shared_ptr<JsonFile>>> ListChatJson);

    BROADCAST_ARGS handleCommand(std::string msg);
    void send_message(std::string msg);

    // Command
    void tryConnectClient(std::vector<std::string>);
    void disconectClient(std::vector<std::string> args);
    void addNewUser(std::vector<std::string> args);
    BROADCAST_ARGS sendMessageOnChat(std::vector<std::string> args);
    void getListChat(std::vector<std::string> args);
    void getListServer(std::vector<std::string> args);

    int _id;

private:
    void _setupServerJson(const boost::property_tree::ptree& user);

    tcp::endpoint _endp;
    tcp::socket& _socket;
    bool _connected;
    std::shared_ptr<JsonFile> _UserJson;
    std::shared_ptr<JsonFile> _ChatsJson;
    std::shared_ptr<JsonFile> _ServerJson;
    std::shared_ptr<std::vector<std::shared_ptr<JsonFile>>> _ListChatJson;

    std::string _name;
    std::map<int, std::string> _listServ;
    std::vector<int> _listChats;
};

// pour broadcast: update le chat actuelle -> dans server class detection d'un ajout puis broadcast au autres

// routes lists:

// OK    connect_client,         id pwd
// OK    disconnect client

// OK    get_client_servers_list                            -> list (server_id/server_name)
//     get_channel_messages        id_server id_channel nb_messages    -> list_message
// OK    send_message_on_server         id_server id_channel message   -> Broadcast new message      to send message to private chat put id_server at -1
//     modify_message_server         id_server id_channel id_message

//     create_server            server_name                ->    id_server
//     create_server_chat        id_server chat_name
//     create_server_vocal        id_server vocal_name

//     delete_server            id_server
//     delete_server_chat        id_server id_channel
//     delete_server_vocal        id_server id_vocal

//     join_server            url_invite                ->    success/fail
//     join_server_vocal        id_server id_vocal
