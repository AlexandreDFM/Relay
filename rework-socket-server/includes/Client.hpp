// #pragma once
// #include "DataFile.hpp"
//
// #include <map>
// #include <mutex>
// #include <string>
// #include <thread>
// #include <iostream>
// #include <boost/asio.hpp>
// #include <boost/beast/websocket.hpp>
//
// using boost::asio::ip::tcp;
// typedef std::tuple<std::vector<int>, bool, std::string> BROADCAST_ARGS;
//
// class Client {
// public:
//     Client(tcp::endpoint& endp, boost::beast::websocket::stream<tcp::socket>&& ws,
//                    std::shared_ptr<JsonFile> UserJson,
//                    std::shared_ptr<JsonFile> ChatJson,
//                    std::shared_ptr<JsonFile> ServerJson,
//                    std::shared_ptr<std::vector<std::shared_ptr<JsonFile>>> ListChatJson);
//     BROADCAST_ARGS handleCommand(std::string msg);
//     void send_message(std::string msg);
//
//     // Command
//     void tryConnectClient(std::vector<std::string>);
//     void disconectClient(std::vector<std::string> args);
//     void addNewUser(std::vector<std::string> args);
//
//     void getListChat(std::vector<std::string> args);
//     void getListServer(std::vector<std::string> args);
//
//     BROADCAST_ARGS sendMessageOnChat(std::vector<std::string> args);
//     BROADCAST_ARGS modifyMessage(std::vector<std::string> args);
//     void getListMessages(std::vector<std::string> args);
//
//     void createServer(std::vector<std::string> args);
//     void createChat(std::vector<std::string> args);
//
//     void deleteServer(std::vector<std::string> args);
//     void deleteChat(std::vector<std::string> args);
//
//     void joinServer(std::vector<std::string> args);
//     void joinChat(std::vector<std::string> args);
//
//     int _id;
//
// private:
//     void _setupServerJson(const boost::property_tree::ptree& user);
//     std::shared_ptr<JsonFile> _loadChat(std::string id_chat);
//
//     tcp::endpoint _endp;
//     tcp::socket _socket;
//     boost::beast::websocket::stream<tcp::socket> _ws; // WebSocket stream member
//     bool _connected;
//     std::shared_ptr<JsonFile> _UserJson;
//     std::shared_ptr<JsonFile> _ChatsJson;
//     std::shared_ptr<JsonFile> _ServerJson;
//     std::shared_ptr<std::vector<std::shared_ptr<JsonFile>>> _ListChatJson;
//
//     std::string _name;
//     std::map<int, std::string> _listServ;
//     std::vector<int> _listChats;
// };
//
// // pour broadcast: update le chat actuelle -> dans server class detection d'un ajout puis broadcast au autres
//
// // routes lists:
//
// // to send message to private chat put id_server at -1
//
// // OK    connect_client,         id pwd
// // ex: 0 Bob pass
// // OK    disconnect client
// // ex: 1
// // OK    add new client
// // ex: 2 name password
//
// // OK    get_client_servers_list                            -> list (server_id/server_name)
// // ex: 5
// // OK    get_channel_messages        id_server id_channel nb_messages    -> list_message
// // ex: 7 0 0 5
// // ex: 7 -1 1 5
// // OK    send_message_on_server         id_server id_channel message   -> Broadcast new message
// // ex: 3 0 0 Salut
// // ex: 3 -1 1 Salut
// // OK    modify_message_server         id_server id_channel id_message message -> Broadcast modified message
// // ex: 6 0 0 1 Ptdr non
// // ex: 6 -1 1 13 Ptdr non
//
// // OK    create_server            server_name                ->    id_server
// // ex: 8 server name
// // OK    create_server_chat        id_server chat_name
// // ex: 9 -1 chat name
// // ex: 9 0 chat name
// //     create_server_vocal        id_server vocal_name
//
// // OK    delete_server            id_server
// // ex: 9 2
// // OK    delete_server_chat        id_server id_channel
// // ex: 9 -1 2
// // ex: 9 1 6
// //     delete_server_vocal        id_server id_vocal
//
// // OK    join_server            url_invite                ->    success/fail
// // ex: 9 invite 1
// // OK    join_server_chat       id_server url_invite                ->    success/fail
// // ex: 9 0 invite_chat 6
// // ex: 9 -1 invite_chat 3
// //     join_server_vocal        id_server id_vocal
//
// // TO DO
// // check nb args
// // check if "/" or "-" in mesg
// // replace substring " " by "\r" or "\t"
// // voice chat

#ifndef CLIENT_HPP
#define CLIENT_HPP

#include <iostream>
#include <map>
#include <mutex>
#include <vector>
#include <string>
#include "DataFile.hpp"
#include <boost/asio/ip/tcp.hpp>
#include <boost/property_tree/ptree.hpp>
#include <boost/beast/websocket.hpp>

// Forward declarations
class JsonFile;

class Client {
public:
    // Constructor and Destructor
    Client(int id, const std::string& address, const std::string& port, boost::asio::io_context& io_context);
    ~Client();

    // Methods to handle client commands
    std::tuple<std::vector<int>, std::vector<std::shared_ptr<Client>>, std::string> handleCommand(std::string msg);
    void disconectClient(std::vector<std::string> args);
    void addNewUser(std::vector<std::string> args);
    void sendMessageOnChat(std::vector<std::string> args);
    void getListChat(std::vector<std::string> args);
    void getListServer(std::vector<std::string> args);
    // void modifyMessage(std::vector<std::string> args);
    // void getListMessages(std::vector<std::string> args);
    // void createServer(std::vector<std::string> args);
    // void createChat(std::vector<std::string> args);
    // void deleteServer(std::vector<std::string> args);
    // void deleteChat(std::vector<std::string> args);
    // void joinServer(std::vector<std::string> args);
    // void joinChat(std::vector<std::string> args);

    void _setupServerJson(const boost::property_tree::ptree& user);
    void tryConnectClient(std::vector<std::string> args);

    // Getters and setters
    int getId() const { return _id; }
    std::string getAddress() const { return _address; }
    std::string getPort() const { return _port; }
    boost::beast::websocket::stream<boost::asio::ip::tcp::socket>& getSocket() { return _ws; }
    bool isConnected() const { return _connected; }

    void setSocket(boost::asio::ip::tcp::socket&& socket) { _ws.next_layer() = std::move(socket); }

    // Utility functions
    std::string strip(const std::string& str);
    std::string mergeStringsExceptFirst(const std::vector<std::string>& args, int index);
    std::pair<int, std::vector<std::string>> splitOpcodeAndArguments(const std::string& msg);
    void send_message(const std::string& message);

private:
    // Member variables
    int _id;
    std::string _address;
    std::string _port;
    bool _connected;
    std::map<int, std::string> _listServ;
    std::vector<int> _listChats;

    // List of chat JSON files
    std::shared_ptr<JsonFile> _ServerJson;
    std::shared_ptr<JsonFile> _UserJson;
    std::shared_ptr<JsonFile> _ChatsJson;

    // User data
    std::string _name;

    // Mutex for thread safety when accessing JSON data
    std::mutex _JsonMutex;

    // Endpoint information for the client
    boost::asio::ip::tcp::endpoint _endp;
    boost::beast::websocket::stream<boost::asio::ip::tcp::socket> _ws; // WebSocket stream member
};

#endif // CLIENT_HPP
