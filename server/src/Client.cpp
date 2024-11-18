
#include "Client.hpp"

Client::Client(tcp::endpoint& endp, tcp::socket& socket, std::shared_ptr<JsonFile> UserJson, std::shared_ptr<JsonFile> ChatJson, std::shared_ptr<std::vector<std::shared_ptr<JsonFile>>> ListChatJson)
    : _socket(socket)
    , _endp(endp)
    , _connected(false)
    , _UserJson(UserJson)
    , _ChatsJson(ChatJson)
    , _ListChatJson(ListChatJson)
{
}

std::pair<int, std::vector<std::string>> splitOpcodeAndArguments(std::string& input)
{
    // Find the first occurrence of "\r"
    auto separator = " ";
    size_t separatorPos = input.find(separator);

    if (input[input.length() - 1] == '\n' && input[input.length() - 2] == '\r') {
        input.pop_back();
        input.pop_back();
    }

    if (separatorPos == std::string::npos) {
        std::vector<std::string> nul;
        return { std::stoi(input), nul };
    }

    // Split the string into opcode and arguments
    int opcode = std::stoi(input.substr(0, separatorPos));
    std::string arguments = input.substr(separatorPos + 1);

    std::vector<std::string> argList;
    std::stringstream ss(arguments);
    std::string arg;

    while (std::getline(ss, arg, separator[0])) {
        if (!arg.empty()) {
            argList.push_back(arg);
        }
    }

    return { opcode, argList };
}

void Client::send_message(std::string message)
{
    try {
        // Send the message to the connected endpoint
        boost::asio::write(_socket, boost::asio::buffer(message));

        std::cout << "Message sent to " << _endp.address().to_string() << ":" << _endp.port() << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Failed to send message: " << e.what() << std::endl;
    }
}

std::vector<int> getListAsVector(const boost::property_tree::ptree& pt, const std::string& key)
{
    std::vector<int> result;

    // Try to find the key and iterate over the child elements
    try {
        for (const auto& item : pt.get_child(key)) {
            result.push_back(std::stoi(item.second.data()));
        }
    } catch (const boost::property_tree::ptree_bad_path& e) {
        std::cerr << "Error: Could not find key '" << key << "': " << e.what() << std::endl;
    }

    return result;
}

void Client::tryConnectClient(std::vector<std::string> args)
{
    if (args.size() >= 2) {
        for (const auto& user : _UserJson->getJson().get_child("users")) {
            std::string userName = user.second.get<std::string>("name");
            std::string userPassword = user.second.get<std::string>("password");

            // Check if the name and password match
            if (userName == args[0] && userPassword == args[1]) {
                _connected = true;
                _name = userName;
                _id = user.second.get<int>("id");
                _listServ = getListAsVector(user.second, "list_serv");
                _listChats = getListAsVector(user.second, "list_chats");

                send_message("200 You are connected\n");
            }
        }
    }
    if (!_connected) {
        send_message("404 User not found\n");
    }
}

void Client::addNewUser(std::vector<std::string> args)
{
    boost::property_tree::ptree emptyList;
    boost::property_tree::ptree newUser;

    newUser.put("name", args[0]);
    newUser.put("password", args[1]);

    for (const auto& user : _UserJson->getJson().get_child("users"))
        if (user.second.get<std::string>("name") == args[0]) {
            send_message("400 User already exist\n");
            return;
        }

    try {
        {
            std::lock_guard<std::mutex> lock(_UserJson->_JsonMutex);
            int id = _UserJson->getJson().get<int>("nb_user");
            newUser.put("id", id);
            _UserJson->getJson().put("nb_user", id + 1);

            _UserJson->getJson().get_child("users").push_back(std::make_pair("", newUser));
            _UserJson->update_json_file();
        }
        send_message("200 User Successfully created\n");
    } catch (const std::exception& e) {
        std::cerr << "Failed to load new user: " << e.what() << std::endl;
        send_message("400 User Failed to created\n");
    }
}

std::string get_current_datetime()
{
    auto now = std::chrono::system_clock::now();
    std::time_t current_time = std::chrono::system_clock::to_time_t(now);

    std::tm* local_time = std::localtime(&current_time);

    std::stringstream ss;
    ss << std::put_time(local_time, "%Y-%m-%d %H:%M:%S");

    return ss.str();
}

std::string mergeStringsExceptFirst(const std::vector<std::string>& args)
{
    std::string result;

    // Start from the second element (index 1)
    for (size_t i = 1; i < args.size(); ++i)
        result += args[i] + " "; // Concatenate each string to result

    return result;
}

BROADCAST_ARGS Client::sendMessageOnChat(std::vector<std::string> args)
{
    try {
        std::shared_ptr<JsonFile> chat = nullptr;

        if (std::find(_listChats.begin(), _listChats.end(), std::stoi(args[0])) != _listChats.end()) {

            for (auto file = _ListChatJson->begin(); file != _ListChatJson->end(); ++file) {
                if ((*file)->_path == "../Database/Chats/" + args[0] + ".json")
                    chat = *file;
            }

            if (chat == nullptr) {
                std::cout << "Load new chat" << std::endl;
                chat = std::make_shared<JsonFile>("../Database/Chats/" + args[0] + ".json");
                _ListChatJson->push_back(chat);
            }

            boost::property_tree::ptree message;
            int id = chat->getJson().get<int>("nb_mesg");
            message.put("id", id);
            message.put("time", get_current_datetime());
            message.put("data", mergeStringsExceptFirst(args));
            message.put("aut", _id);

            {
                std::lock_guard<std::mutex> lock(chat->_JsonMutex);
                chat->getJson().put("nb_mesg", id + 1);

                chat->getJson().get_child("messages").push_back(std::make_pair("", message));
                chat->update_json_file();
                std::cout << "Update new chat" << std::endl;
            }

            std::vector<int> _listAutUsers;
            for (auto dict : _ChatsJson->getJson().get_child("chats"))
                if (dict.second.get<int>("id") == std::stoi(args[0]))
                    _listAutUsers = getListAsVector(dict.second, "aut_user");

            _listAutUsers.erase(std::remove(_listAutUsers.begin(), _listAutUsers.end(), _id), _listAutUsers.end());

            return std::make_tuple(std::move(_listAutUsers), false, "New message on Chat " + args[0]);
        }

    } catch (const std::exception& e) {
        std::cerr << "Error in Sending message to Chat: " << e.what() << std::endl;
    }

    return std::make_tuple<std::vector<int>, bool, std::string>({}, false, "");
}

BROADCAST_ARGS Client::handleCommand(std::string msg)
{
    try {
        auto [opcode, arguments] = splitOpcodeAndArguments(msg);
        std::cout << "Message from " << _endp.address().to_string() << ":" << _endp.port() << std::endl;

        std::cout << "Opcode : " << opcode << std::endl;
        std::cout << "Args:";

        for (auto ms : arguments) {
            std::cout << " " << ms;
        }
        std::cout << std::endl;

        switch (opcode) {
        case 0:
            tryConnectClient(arguments);
            break;
        case 1:
            addNewUser(arguments);
            break;
        case 2:
            return sendMessageOnChat(arguments);
        default:
            break;
        }

    } catch (const std::exception& e) {
        std::cerr << "Exception in client handler thread: " << e.what() << std::endl;
    }

    return std::make_tuple<std::vector<int>, bool, std::string>({}, false, "");
}
