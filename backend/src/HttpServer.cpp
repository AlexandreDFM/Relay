#include "HttpServer.hpp"

HttpServer::HttpServer(boost::asio::io_context& ioc, const boost::asio::ip::tcp::endpoint& endpoint)
    : ioc_(ioc), acceptor_(ioc, endpoint) {
    Database::loadDatabase(); // Load database when server starts
    accept();
}

void HttpServer::accept() {
    acceptor_.async_accept([this](boost::beast::error_code ec, boost::asio::ip::tcp::socket socket) {
        if (!ec) {
            std::make_shared<HttpSession>(std::move(socket))->start();
        }
        accept();
    });
}
