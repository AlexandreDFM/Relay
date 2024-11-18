#pragma once
#include "Chats.hpp"
#include "Client.hpp"

#include <boost/asio.hpp>
#include <iostream>
#include <map>
#include <mutex>
#include <thread>

class Clients;

using boost::asio::ip::tcp;

class Server {
public:
    Server(int port);
    ~Server();
    void handleNewClient(tcp::socket socket);
    void broadcast(std::string msg);

private:
    boost::asio::io_context io_context;
    tcp::acceptor acceptor;
    std::mutex map_mutex;

    std::map<tcp::endpoint, std::shared_ptr<Client>> _listClient;
    std::map<std::string, Chats> _listChats;

    std::shared_ptr<JsonFile> _UserJson;
};

/// thread qui listen en boucle et feed un buufer circulaire
/// main thread qui feed le bon client en fonction de la provenance
/// client executes ses commandes
