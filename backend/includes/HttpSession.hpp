#ifndef HTTPSESSION_HPP
#define HTTPSESSION_HPP

#include <iostream>
#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <boost/json.hpp>
#include "Database.hpp"

class HttpSession : public std::enable_shared_from_this<HttpSession> {
    boost::asio::ip::tcp::socket socket_;
    boost::beast::flat_buffer buffer_;
    boost::beast::http::request<boost::beast::http::string_body> req_;
    boost::asio::steady_timer timer_; // Add a timer for setting expiration

public:
    explicit HttpSession(boost::asio::ip::tcp::socket socket);

    void start();

private:
    void readRequest();
    void handleRequest();
    void writeResponse(boost::beast::http::response<boost::beast::http::string_body>& res);

    boost::json::array getAllChats();
    boost::json::object getChat(std::string chatId);
    void sendMessage(std::string chatId, const boost::json::value& messageData);
};

#endif // HTTPSESSION_HPP