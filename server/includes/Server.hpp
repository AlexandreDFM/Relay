#pragma once

#include <map>
#include <mutex>
#include <thread>
#include <memory>
#include <iostream>
#include <boost/asio.hpp>

#include "Chats.hpp"

class Client;

using boost::asio::ip::tcp;

class Server : public std::enable_shared_from_this<Server> {
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
};

/// thread qui listen en boucle et feed un buufer circulaire
/// main thread qui feed le bon client en fonction de la provenance
/// client executes ses commandes
