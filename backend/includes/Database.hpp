#ifndef DATABASE_HPP
#define DATABASE_HPP

#include <boost/json.hpp>
#include <string>

class Database {
    static boost::json::value db;

public:
    static void loadDatabase();
    static void saveDatabase();

    // User management
    static void registerUser(const boost::json::value& userData);
    static boost::json::object loginUser(const std::string& email, const std::string& password);
    static void deleteUser(const std::string& userId);

    // Chat management
    static boost::json::array getChats();
    static boost::json::object getChat(const std::string& chatId);
    static void addMessage(const std::string& chatId, const boost::json::value& message);
};

#endif // DATABASE_HPP
