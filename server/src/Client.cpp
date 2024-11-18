
#include "Client.hpp"

Client::Client(tcp::endpoint& endp, tcp::socket& ctx, std::shared_ptr<JsonFile> userjson)
    : _socket(ctx)
    , _endp(endp)
    , _connected(false)
    , _UserJson(userjson)
{
}

std::pair<int, std::vector<std::string>> splitOpcodeAndArguments(std::string& input)
{
    // Find the first occurrence of "\r"
    auto separator = " ";
    size_t separatorPos = input.find(separator);

    if (input[input.length()] == '\n')
        input.pop_back();
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

void Client::tryConnectClient(std::vector<std::string> args)
{
    if (args.size() >= 2) {
        for (const auto& user : _UserJson->getJson().get_child("users")) {
            std::string userName = user.second.get<std::string>("name");
            std::string userPassword = user.second.get<std::string>("password");

            // Check if the name and password match
            if (userName == args[0] && userPassword == args[1]) {
                _connected = true;
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

void Client::handleCommand(std::string msg)
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

        default:
            break;
        }

    } catch (const std::exception& e) {
        std::cerr << "Exception in client handler thread: " << e.what() << std::endl;
    }
}
