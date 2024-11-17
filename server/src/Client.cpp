
#include "Client.hpp"
#include "Server.hpp"

Client::Client(std::shared_ptr<Server> serv, tcp::endpoint& endp, tcp::socket& ctx)
    : _socket(ctx)
    , _endp(endp)
    , _connected(false)
    , _serv(serv)
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
    if (args.size() >= 2 && args.at(0) == "Bob" && args.at(1) == "pass") {
        _connected = true;

        send_message("200 You are connected\n");
    } else {
        send_message("404 User not found\n");
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

        default:
            break;
        }

    } catch (const std::exception& e) {
        std::cerr << "Exception in client handler thread: " << e.what() << std::endl;
    }
}
