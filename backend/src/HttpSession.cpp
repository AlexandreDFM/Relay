#include "HttpSession.hpp"
#include <iostream>
#include <boost/beast/version.hpp>

namespace http = boost::beast::http;
namespace json = boost::json;

HttpSession::HttpSession(boost::asio::ip::tcp::socket socket)
    : socket_(std::move(socket)), timer_(socket_.get_executor()) {}

void HttpSession::start() {
    readRequest();
}

void HttpSession::readRequest() {
    auto self = shared_from_this();

    req_ = {};
    std::cout << "Reading request..." << std::endl;
    timer_.expires_after(std::chrono::seconds(15));

    http::async_read(socket_, buffer_, req_,
        [self](boost::beast::error_code ec, std::size_t bytes_transferred) {
            boost::ignore_unused(bytes_transferred);
            if (!ec) {
                std::cout << "Request received: " << self->req_.target() << std::endl;
                self->handleRequest();
            } else {
                std::cerr << "Read error: " << ec.message() << std::endl;
                self->socket_.close();
            }
        });

    timer_.async_wait([self](boost::beast::error_code ec) {
        if (ec != boost::asio::error::operation_aborted) {
            self->socket_.close();
        }
    });
}

void HttpSession::writeResponse(http::response<http::string_body>& res) {
    auto self = shared_from_this();

    http::async_write(socket_, res,
        [self, res](boost::beast::error_code ec, std::size_t bytes_transferred) {
            std::cout << "Response: " << res << std::endl;
            boost::ignore_unused(bytes_transferred);
            if (!ec) {
                if (res.need_eof()) {
                    boost::system::error_code ignored_ec;
                    self->socket_.shutdown(boost::asio::ip::tcp::socket::shutdown_send, ignored_ec);
                } else if (res.keep_alive()) {
                    self->readRequest();
                } else {
                    self->socket_.close();
                }
            } else {
                std::cerr << "Write error: " << ec.message() << std::endl;
                self->socket_.close();
            }
        });
}

void HttpSession::handleRequest() {
    http::response<http::string_body> res{http::status::ok, req_.version()};
    res.set(http::field::server, BOOST_BEAST_VERSION_STRING);
    res.set(http::field::content_type, "application/json");
    res.keep_alive(req_.keep_alive());

    if (!req_.keep_alive()) {
        res.set(http::field::connection, "close");
    }

    try {
        if (req_.method() == http::verb::post && req_.target() == "/users/register") {
            auto body = json::parse(req_.body());
            Database::registerUser(body);
            res.body() = R"({"status": "User registered successfully"})";
        } else if (req_.method() == http::verb::post && req_.target() == "/users/login") {
            auto body = json::parse(req_.body());
            auto user = Database::loginUser(body.at("email").as_string().c_str(),
                                            body.at("password").as_string().c_str());
            res.body() = json::serialize(user);
        } else if (req_.method() == http::verb::delete_ && req_.target().find("/users/") == 0) {
            std::string userId = std::string(req_.target()).substr(7);
            Database::deleteUser(userId);
            res.body() = R"({"status": "User deleted successfully"})";
        } else if (req_.method() == http::verb::get && req_.target() == "/chats") {
            res.body() = json::serialize(getAllChats());
        } else if (req_.method() == http::verb::get && req_.target().find("/chat/") == 0) {
            std::string chatId = std::string(req_.target()).substr(6);
            res.body() = json::serialize(getChat(chatId));
        } else if (req_.method() == http::verb::post && req_.target().find("/chat/") == 0) {
            auto pos = std::string(req_.target()).find("/send");
            if (pos != std::string::npos) {
                std::string chatId = std::string(req_.target()).substr(6, pos - 6);
                auto body = json::parse(req_.body());
                sendMessage(chatId, body);
                res.body() = R"({"status": "message sent"})";
            } else {
                throw std::runtime_error("Invalid endpoint");
            }
        } else {
            res.result(http::status::not_found);
            res.body() = R"({"error": "Endpoint not found"})";
        }
    } catch (const std::exception& e) {
        res.result(http::status::internal_server_error);
        res.set(http::field::content_type, "text/plain");
        res.body() = std::string("Internal Server Error: ") + e.what();
    }

    res.prepare_payload();
    writeResponse(res);
}

boost::json::array HttpSession::getAllChats() {
    return Database::getChats();
}

boost::json::object HttpSession::getChat(std::string chatId) {
    return Database::getChat(chatId);
}

void HttpSession::sendMessage(std::string chatId, const boost::json::value& messageData) {
    Database::addMessage(chatId, messageData);
}