#ifndef HTTPSERVER_HPP
    #define HTTPSERVER_HPP

#include <boost/asio.hpp>
#include "HttpSession.hpp"

class HttpServer {
    boost::asio::io_context& ioc_;
    boost::asio::ip::tcp::acceptor acceptor_;

public:
    HttpServer(boost::asio::io_context& ioc, const boost::asio::ip::tcp::endpoint& endpoint);

private:
    void accept();
};

#endif // HTTPSERVER_HPP
