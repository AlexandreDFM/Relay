#include "Database.hpp"
#include <ctime>
#include <fstream>
#include <sstream>
#include <iostream>
#include <stdexcept>
#include <algorithm>

namespace json = boost::json;

json::value Database::db;

void Database::loadDatabase() {
    std::ifstream dbFile("../Database/database.json");
    if (!dbFile) {
        // Create an empty database if the file doesn't exist
        db = json::object{
            {"users", json::array{}},
            {"chats", json::array{}}
        };
        saveDatabase();
        return;
        // throw std::runtime_error("Database file not found");
    }
    std::ostringstream oss;
    oss << dbFile.rdbuf();
    db = json::parse(oss.str());
}

void Database::saveDatabase() {
    std::ofstream dbFile("database.json");
    dbFile << json::serialize(db);
}

void Database::registerUser(const json::value& userData) {
    auto& users = db.at("users").as_array();
    std::string email = userData.at("email").as_string().c_str();

    auto userExists = std::find_if(users.begin(), users.end(), [&](const json::value& user) {
        return user.at("email").as_string() == email;
    });

    if (userExists != users.end()) {
        throw std::runtime_error("User with this email already exists");
    }

    users.push_back(userData);
    saveDatabase();
}

json::object Database::loginUser(const std::string& email, const std::string& password) {
    auto& users = db.at("users").as_array();

    for (auto& user : users) {
        if (user.at("email").as_string() == email &&
            user.at("password").as_string() == password) {
            return user.as_object();
        }
    }

    throw std::runtime_error("Invalid email or password");
}

void Database::deleteUser(const std::string& userId) {
    auto& users = db.at("users").as_array();

    auto it = std::remove_if(users.begin(), users.end(), [&](const json::value& user) {
        return user.at("id").as_string() == userId;
    });

    if (it == users.end()) {
        throw std::runtime_error("User not found");
    }

    users.erase(it, users.end());
    saveDatabase();
}

// Chat management remains unchanged
json::array Database::getChats() { return db.at("chats").as_array(); }

json::object Database::getChat(const std::string& chatId) {
    auto& chats = db.at("chats").as_array();
    for (auto& chat : chats) {
        if (chat.at("id").as_string() == chatId) {
            return chat.as_object();
        }
    }
    throw std::runtime_error("Chat not found");
}

void Database::addMessage(const std::string& chatId, const json::value& message) {
    auto& chats = db.at("chats").as_array();
    for (auto& chat : chats) {
        if (chat.at("id").as_string() == chatId) {
            auto& messages = chat.as_object()["messages"].as_array();
            messages.push_back(message);
            saveDatabase();
            return;
        }
    }
    throw std::runtime_error("Chat not found");
}
