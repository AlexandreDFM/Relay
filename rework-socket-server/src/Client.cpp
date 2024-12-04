// #include "Client.hpp"
// #include <algorithm>
// #include <cctype>
// #include <stdexcept>
// #include <string>
// #include <boost/beast/websocket/stream.hpp>
//

// std::string get_current_datetime()
// {
//     auto now = std::chrono::system_clock::now();
//     std::time_t current_time = std::chrono::system_clock::to_time_t(now);
//
//     std::tm* local_time = std::localtime(&current_time);
//
//     std::stringstream ss;
//     ss << std::put_time(local_time, "%Y-%m-%d %H:%M:%S");
//
//     return ss.str();
// }

// std::string mergeStringsExceptFirst(const std::vector<std::string>& args, int start)
// {
//     std::string result;
//
//     // Start from the second element (index 1)
//     for (size_t i = start; i < args.size(); ++i)
//         result += args[i] + " "; // Concatenate each string to result
//
//     return result;
// }
//
// std::pair<int, std::vector<std::string>> splitOpcodeAndArguments(std::string& input) {
//     auto separator = " ";
//     size_t separatorPos = input.find(separator);
//
//     if (input[input.length() - 1] == '\n' && input[input.length() - 2] == '\r') {
//         input.pop_back();
//         input.pop_back();
//     }
//
//     if (separatorPos == std::string::npos) {
//         std::vector<std::string> nul;
//         try {
//             int opcode = std::stoi(input);
//             return { opcode, nul };
//         } catch (const std::invalid_argument& e) {
//             std::cerr << "Invalid argument in splitOpcodeAndArguments: " << e.what() << " for input: " << input << std::endl;
//             return { -1, nul };
//         } catch (const std::out_of_range& e) {
//             std::cerr << "Out of range in splitOpcodeAndArguments: " << e.what() << " for input: " << input << std::endl;
//             return { -1, nul };
//         }
//     }
//
//     int opcode;
//     try {
//         opcode = std::stoi(input.substr(0, separatorPos));
//     } catch (const std::invalid_argument& e) {
//         std::cerr << "Invalid argument in splitOpcodeAndArguments: " << e.what() << " for input: " << input.substr(0, separatorPos) << std::endl;
//         return { -1, {} };
//     } catch (const std::out_of_range& e) {
//         std::cerr << "Out of range in splitOpcodeAndArguments: " << e.what() << " for input: " << input.substr(0, separatorPos) << std::endl;
//         return { -1, {} };
//     }
//
//     std::string arguments = input.substr(separatorPos + 1);
//     std::vector<std::string> argList;
//     std::stringstream ss(arguments);
//     std::string arg;
//
//     while (std::getline(ss, arg, separator[0])) {
//         if (!arg.empty()) {
//             argList.push_back(arg);
//         }
//     }
//
//     return { opcode, argList };
// }
//
// std::vector<int> getListAsVector(const boost::property_tree::ptree& pt, const std::string& key)
// {
//     std::vector<int> result;
//
//     // Try to find the key and iterate over the child elements
//     try {
//         for (const auto& item : pt.get_child(key)) {
//             result.push_back(std::stoi(item.second.data()));
//         }
//     } catch (const boost::property_tree::ptree_bad_path& e) {
//         std::cerr << "Error: Could not find key '" << key << "': " << e.what() << std::endl;
//     }
//
//     return result;
// }
//
// std::string strip(const std::string& input)
// {
//     // Find the first non-whitespace character
//     size_t start = input.find_first_not_of(" \t\n\r\f\v");
//     if (start == std::string::npos) {
//         // String is entirely whitespace
//         return "";
//     }
//
//     // Find the last non-whitespace character
//     size_t end = input.find_last_not_of(" \t\n\r\f\v");
//
//     // Return the trimmed substring
//     return input.substr(start, end - start + 1);
// }
//
// Client::Client(tcp::endpoint& endp, boost::beast::websocket::stream<tcp::socket>&& ws,
//                std::shared_ptr<JsonFile> UserJson,
//                std::shared_ptr<JsonFile> ChatJson,
//                std::shared_ptr<JsonFile> ServerJson,
//                std::shared_ptr<std::vector<std::shared_ptr<JsonFile>>> ListChatJson)
//     : _endp(endp)
//     , _socket(std::move(ws.next_layer()))  // Initialize the underlying socket
//     , _ws(std::move(ws))                  // Move the WebSocket stream
//     , _connected(true)
//     , _UserJson(UserJson)
//     , _ChatsJson(ChatJson)
//     , _ServerJson(ServerJson)
//     , _ListChatJson(ListChatJson)
// {
// }
//
// std::shared_ptr<JsonFile> Client::_loadChat(std::string id_chat)
// {
//     // check if already loaded
//     std::shared_ptr<JsonFile> chat;
//
//     for (auto file = _ListChatJson->begin(); file != _ListChatJson->end(); ++file) {
//         if ((*file)->_path == "../Database/Chats/" + id_chat + ".json")
//             chat = *file;
//     }
//
//     if (chat == nullptr) {
//         std::cout << "Load new chat" << std::endl;
//         chat = std::make_shared<JsonFile>("../Database/Chats/" + id_chat + ".json");
//         _ListChatJson->push_back(chat);
//     }
//
//     return chat;
// }
//
// void Client::send_message(std::string message) {
//     try {
//         std::cout << "Sending message to " << _endp.address().to_string() << ":" << _endp.port() << " - " << message << std::endl;
//
//         // Check if the WebSocket stream is open before writing
//         if (_ws.is_open()) {
//             // Send the message using the WebSocket stream
//             _ws.write(boost::asio::buffer(message));
//             std::cout << "Message sent to " << _endp.address().to_string() << ":" << _endp.port() << std::endl;
//         } else {
//             std::cerr << "WebSocket stream is not open. Cannot send message." << std::endl;
//         }
//     } catch (const std::exception& e) {
//         std::cerr << "Failed to send message: " << e.what() << std::endl;
//     }
// }
//
// void Client::_setupServerJson(const boost::property_tree::ptree& user)
// {
//     auto listServId = getListAsVector(user, "list_serv");
//
//     for (const auto& serverNode : _ServerJson->getJson().get_child("servers")) {
//         const auto& server = serverNode.second;
//
//         // Get the server ID and name
//         int id = server.get<int>("id");
//         std::string name = server.get<std::string>("name");
//
//         // Check if the ID is in the provided vector
//         if (std::find(listServId.begin(), listServId.end(), id) != listServId.end())
//             _listServ[id] = name;
//     }
// }
//
// void Client::tryConnectClient(std::vector<std::string> args)
// {
//     if (args.size() >= 2) {
//         for (const auto& user : _UserJson->getJson().get_child("users")) {
//             std::string userName = user.second.get<std::string>("name");
//             std::string userPassword = user.second.get<std::string>("password");
//
//             // Check if the name and password match
//             if (userName == args[0] && userPassword == args[1]) {
//                 _connected = true;
//                 _name = userName;
//                 _id = user.second.get<int>("id");
//                 _setupServerJson(user.second);
//                 _listChats = getListAsVector(user.second, "list_chats");
//
//                 send_message("200 You are connected\n");
//             }
//         }
//     }
//     if (!_connected) {
//         send_message("404 User not found\n");
//     }
// }
//
// void Client::disconectClient(std::vector<std::string> args)
// {
//     _connected = false;
//     _name = "";
//     _id = -1;
//     _listServ.clear();
//     _listChats.clear();
//     send_message("200 Client disconnected\n");
// }
//
// void Client::addNewUser(std::vector<std::string> args)
// {
//     boost::property_tree::ptree emptyList;
//     boost::property_tree::ptree newUser;
//
//     newUser.put("name", args[0]);
//     newUser.put("password", args[1]);
//
//     for (const auto& user : _UserJson->getJson().get_child("users"))
//         if (user.second.get<std::string>("name") == args[0]) {
//             send_message("400 User already exist\n");
//             return;
//         }
//
//     try {
//         {
//             std::lock_guard<std::mutex> lock(_UserJson->_JsonMutex);
//             int id = _UserJson->getJson().get<int>("nb_user");
//             newUser.put("id", id);
//             _UserJson->getJson().put("nb_user", id + 1);
//
//             _UserJson->getJson().get_child("users").push_back(std::make_pair("", newUser));
//             _UserJson->update_json_file();
//         }
//         send_message("200 User Successfully created\n");
//     } catch (const std::exception& e) {
//         std::cerr << "Failed to load new user: " << e.what() << std::endl;
//         send_message("400 User Failed to created\n");
//     }
// }
//
// BROADCAST_ARGS Client::modifyMessage(std::vector<std::string> args)
// {
//     try {
//         std::shared_ptr<JsonFile> chat = nullptr;
//         int idServ = std::stoi(args[0]);
//         int messageId = std::stoi(args[2]); // Message ID to modify
//
//         // Check if user is in the server
//         if (idServ == -1 || _listServ.find(idServ) != _listServ.end()) {
//             // Check if user has the right to modify messages in the channel
//             if (std::find(_listChats.begin(), _listChats.end(), std::stoi(args[1])) != _listChats.end()) {
//
//                 chat = _loadChat(args[1]);
//
//                 std::cout << "Modifying message ID: " << messageId << std::endl;
//
//                 {
//                     std::lock_guard<std::mutex> lock(chat->_JsonMutex);
//
//                     // Find the message with the given ID
//                     auto& messages = chat->getJson().get_child("messages");
//                     bool messageFound = false;
//
//                     for (auto& msg : messages) {
//                         if (msg.second.get<int>("id") == messageId && msg.second.get<int>("aut") == _id) {
//                             // Modify the message content
//                             msg.second.put("data", mergeStringsExceptFirst(args, 3));
//                             msg.second.put("time", get_current_datetime());
//                             msg.second.put("aut", _id); // Update the author ID
//                             messageFound = true;
//                             break;
//                         }
//                     }
//
//                     if (!messageFound) {
//                         send_message("404 Message not found");
//                         return std::make_tuple<std::vector<int>, bool, std::string>({}, false, "");
//                     }
//
//                     chat->update_json_file();
//                     std::cout << "Message updated successfully" << std::endl;
//                 }
//
//                 std::vector<int> _listAutUsers;
//                 for (auto dict : _ChatsJson->getJson().get_child("chats")) {
//                     if (dict.second.get<std::string>("id") == args[1])
//                         _listAutUsers = getListAsVector(dict.second, "aut_user");
//                 }
//                 _listAutUsers.erase(std::remove(_listAutUsers.begin(), _listAutUsers.end(), _id), _listAutUsers.end());
//
//                 return std::make_tuple(std::move(_listAutUsers), false, "Message modified on Chat " + args[1]);
//             } else {
//                 send_message("400 No right to this channel");
//             }
//
//         } else {
//             send_message("400 No right to this channel");
//         }
//
//     } catch (const std::exception& e) {
//         std::cerr << "Error in Modifying message in Chat: " << e.what() << std::endl;
//     }
//
//     return std::make_tuple<std::vector<int>, bool, std::string>({}, false, "");
// }
//
// void Client::getListChat(std::vector<std::string> args)
// {
//     std::string resp = "200 ";
//
//     for (auto id : _listChats)
//         resp += std::to_string(id) + "-";
//
//     resp[resp.length() - 1] = '\n';
//     std::cout << "resp: " << resp;
//     send_message(resp);
// }
//
// void Client::getListServer(std::vector<std::string> args)
// {
//     std::string resp = "200 ";
//
//     for (const auto& [id, name] : _listServ)
//         resp += std::to_string(id) + "/" + name + "-";
//
//     resp[resp.length() - 1] = '\n';
//     std::cout << "resp: " << resp;
//     send_message(resp);
// }
//
// BROADCAST_ARGS Client::sendMessageOnChat(std::vector<std::string> args)
// {
//
//     try {
//         std::shared_ptr<JsonFile> chat = nullptr;
//         int idServ = std::stoi(args[0]);
//
//         // check if he's in the server
//         if (idServ == -1 || _listServ.find(idServ) != _listServ.end()) {
//             // check if he have the rigth to write
//             if (std::find(_listChats.begin(), _listChats.end(), std::stoi(args[1])) != _listChats.end()) {
//
//                 chat = _loadChat(args[1]);
//
//                 boost::property_tree::ptree message;
//                 int id = chat->getJson().get<int>("nb_mesg");
//                 message.put("id", id);
//                 message.put("time", get_current_datetime());
//                 message.put("data", mergeStringsExceptFirst(args, 2));
//                 message.put("aut", _id);
//
//                 std::cout << "prepare message : " << id << std::endl;
//
//                 {
//                     std::lock_guard<std::mutex> lock(chat->_JsonMutex);
//                     chat->getJson().put("nb_mesg", id + 1);
//
//                     chat->getJson().get_child("messages").push_back(std::make_pair("", message));
//                     chat->update_json_file();
//                     std::cout << "Update new chat" << std::endl;
//                 }
//
//                 std::vector<int> _listAutUsers;
//                 for (auto dict : _ChatsJson->getJson().get_child("chats"))
//                     if (dict.second.get<std::string>("id") == args[1])
//                         _listAutUsers = getListAsVector(dict.second, "aut_user");
//                 _listAutUsers.erase(std::remove(_listAutUsers.begin(), _listAutUsers.end(), _id), _listAutUsers.end());
//
//                 return std::make_tuple(std::move(_listAutUsers), false, "New message on Chat " + args[1]);
//             } else {
//                 send_message("400 no right to this channel");
//             }
//
//         } else
//             send_message("400 no right to this channel");
//
//     } catch (const std::exception& e) {
//         std::cerr << "Error in Sending message to Chat: " << e.what() << std::endl;
//     }
//
//     return std::make_tuple<std::vector<int>, bool, std::string>({}, false, "");
// }
//
// void Client::getListMessages(std::vector<std::string> args)
// {
//
//     try {
//         std::shared_ptr<JsonFile> chat = nullptr;
//         int idServ = std::stoi(args[0]);
//
//         // check if he's in the server
//         if (idServ == -1 || _listServ.find(idServ) != _listServ.end()) {
//             // check if he have the rigth to write
//             if (std::find(_listChats.begin(), _listChats.end(), std::stoi(args[1])) != _listChats.end()) {
//
//                 chat = _loadChat(args[1]);
//
//                 std::string resp = "200 ";
//
//                 auto& messages = chat->getJson().get_child("messages");
//                 if (messages.empty()) {
//                     send_message("404 no message");
//                     return;
//                 }
//
//                 // Iterate from the end to get the last 5 messages
//                 auto it = messages.rbegin();
//                 for (int i = 0; i < std::stoi(args[2]) && it != messages.rend(); ++i, ++it) {
//                     std::string content = it->second.get<std::string>("data", "") + "/" + it->second.get<std::string>("time", "") + "/" + it->second.get<std::string>("aut", ""); // Default to empty string if no data
//                     resp += content + "-";
//                 }
//
//                 resp[resp.length() - 1] = '\n';
//                 std::cout << "resp: " << resp;
//
//                 send_message(resp);
//             } else {
//                 send_message("400 no right to this channel");
//             }
//
//         } else
//             send_message("400 no right to this channel");
//
//     } catch (const std::exception& e) {
//         std::cerr << "Error in Sending message to Chat: " << e.what() << std::endl;
//     }
// }
//
// void Client::createServer(std::vector<std::string> args)
// {
//     try {
//         int nbServ = _ServerJson->getJson().get<int>("nb_serv");
//
//         // Create a new server entry
//         boost::property_tree::ptree newServer;
//
//         newServer.put("id", nbServ); // ID of the new server
//         newServer.put("name", args[0]); // Server name
//         newServer.put("invite", "invite " + std::to_string(nbServ)); // Generate an invite
//         newServer.add("chats", ""); // Empty chat list
//
//         // Add the first authorized user
//         boost::property_tree::ptree autUserArray;
//         boost::property_tree::ptree autUser;
//         autUser.put_value(_id);
//         autUserArray.push_back(std::make_pair("", autUser));
//         newServer.add_child("aut_user", autUserArray);
//
//         {
//             std::lock_guard<std::mutex> lock(_ServerJson->_JsonMutex);
//             // Add the new server to the servers list
//             _ServerJson->getJson().get_child("servers").push_back(std::make_pair("", newServer));
//             // Increment the number of servers
//             _ServerJson->getJson().put("nb_serv", nbServ + 1);
//             _ServerJson->update_json_file();
//         }
//         std::cout << "Added new server: " << args[0] << " with ID: " << nbServ << std::endl;
//
//         boost::property_tree::ptree nbChatsNode;
//         nbChatsNode.put("", nbServ);
//         for (auto& server : _UserJson->getJson().get_child("users")) {
//             if (server.second.get<int>("id") == _id) {
//                 // Server found, add chatId to its chats list
//                 {
//                     std::lock_guard<std::mutex> lock(_UserJson->_JsonMutex);
//                     server.second.get_child("list_serv").push_back(std::make_pair("", nbChatsNode));
//                     _UserJson->update_json_file();
//                 }
//
//                 // Indicate that the server was found and updated
//                 std::cout << "Server ID " << nbServ << " added to User ID " << _id << std::endl;
//                 send_message("200 added to client list\n");
//                 break;
//             }
//         }
//         _listServ[nbServ] = args[0];
//         send_message("200 creation of server\n");
//     } catch (const std::exception& e) {
//         std::cerr << "Error adding new server: " << e.what() << std::endl;
//         send_message("400 error during creation of server\n");
//     }
// }
//
// void Client::createChat(std::vector<std::string> args)
// {
//     try {
//         int serverId = std::stoi(args[0]);
//         int nbChats = _ChatsJson->getJson().get<int>("nb_chat");
//         boost::property_tree::ptree nbChatsNode;
//         nbChatsNode.put("", nbChats);
//
//         if (serverId != -1) {
//             bool serverFound = false;
//             for (auto& server : _ServerJson->getJson().get_child("servers")) {
//                 if (server.second.get<int>("id") == serverId) {
//                     // Server found, add chatId to its chats list
//                     {
//                         std::lock_guard<std::mutex> lock(_ServerJson->_JsonMutex);
//                         server.second.get_child("chats").push_back(std::make_pair("", nbChatsNode));
//                         _ServerJson->update_json_file();
//                     }
//
//                     // Indicate that the server was found and updated
//                     serverFound = true;
//                     std::cout << "Chat ID " << nbChats << " added to Server ID " << serverId << std::endl;
//                     send_message("200 added to server list\n");
//                     break;
//                 }
//             }
//
//             if (!serverFound) {
//                 std::cerr << "Server ID " << serverId << " not found." << std::endl;
//             }
//         } else
//             args[1] = "private";
//
//         // Create a new chat entry
//         boost::property_tree::ptree newChat;
//         newChat.put("id", nbChats); // Chat ID based on current count
//         newChat.put("name", args[1]); // Chat name
//         newChat.put("invite", "invite_chat " + std::to_string(nbChats)); // Generate an invite
//
//         // Add authorized users
//         boost::property_tree::ptree autUserArray;
//         boost::property_tree::ptree userNode;
//         userNode.put_value(_id);
//         autUserArray.push_back(std::make_pair("", userNode));
//         newChat.add_child("aut_user", autUserArray);
//
//         {
//             std::lock_guard<std::mutex> lock(_ChatsJson->_JsonMutex);
//             // Add the new chat to the chats list
//             _ChatsJson->getJson().get_child("chats").push_back(std::make_pair("", newChat));
//             // Increment the number of chats
//             _ChatsJson->getJson().put("nb_chat", nbChats + 1);
//             _ChatsJson->update_json_file();
//         }
//
//         std::cout << "Added new chat: " << args[1] << " with ID: " << nbChats << std::endl;
//         send_message("200 added to Chat list\n");
//
//         // CREATE NEW FILE
//         std::string path = "../Database/Chats/" + std::to_string(nbChats) + ".json";
//         std::ofstream outFile(path);
//
//         if (outFile.is_open()) {
//             // Write the JSON content to the file
//             outFile << "{\n    \"nb_mesg\": \"0\",\n    \"messages\": []\n}\n";
//
//             // Close the file
//             outFile.close();
//             std::cout << "File " << path << " has been created successfully." << std::endl;
//             send_message("200 file created in database\n");
//         } else {
//             std::cerr << "Error opening file for writing!" << std::endl;
//             send_message("400 file not created in database\n");
//         }
//
//         _listChats.push_back(nbChats);
//         for (auto& server : _UserJson->getJson().get_child("users")) {
//             if (server.second.get<int>("id") == _id) {
//                 // Server found, add chatId to its chats list
//                 {
//                     std::lock_guard<std::mutex> lock(_UserJson->_JsonMutex);
//                     server.second.get_child("list_chats").push_back(std::make_pair("", nbChatsNode));
//                     _UserJson->update_json_file();
//                 }
//
//                 // Indicate that the server was found and updated
//                 std::cout << "Chat ID " << nbChats << " added to User ID " << _id << std::endl;
//                 send_message("200 added to client list\n");
//                 break;
//             }
//         }
//
//     } catch (const std::exception& e) {
//         std::cerr << "Error adding new server: " << e.what() << std::endl;
//         send_message("400 error during creation of server\n");
//     }
// }
//
// void Client::deleteServer(std::vector<std::string> args)
// {
//     try {
//         int serverId = std::stoi(args[0]);
//         bool serverFound = false;
//
//         for (const auto& pair : _listServ)
//             if (serverId == pair.first) {
//                 serverFound = true;
//                 break;
//             }
//
//         if (!serverFound)
//             return;
//
//         serverFound = false;
//
//         // Get the root of the servers list
//         boost::property_tree::ptree& servers = _ServerJson->getJson().get_child("servers");
//
//         // Iterate over the servers to find the matching id
//         for (auto it = servers.begin(); it != servers.end(); ++it) {
//             if (it->second.get<int>("id") == serverId) {
//                 {
//                     std::lock_guard<std::mutex> lock(_ServerJson->_JsonMutex);
//                     servers.erase(it);
//                     _ServerJson->update_json_file();
//                 }
//
//                 serverFound = true;
//                 send_message("200 server deleted \n");
//                 _listServ.erase(serverId);
//                 break;
//             }
//         }
//
//         if (!serverFound) {
//             std::cerr << "Server ID " << serverId << " not found." << std::endl;
//             send_message("400 Server ID not found\n");
//         } else {
//
//             // Remove chat from user’s chat list
//             for (auto& user : _UserJson->getJson().get_child("users")) {
//                 if (user.second.get<int>("id") == _id) {
//                     for (auto it = user.second.get_child("list_serv").begin(); it != user.second.get_child("list_serv").end(); ++it) {
//                         if (it->second.data() == std::to_string(serverId)) {
//                             // Chat found in user, erase it
//                             std::cout << "hello\n";
//                             {
//                                 std::lock_guard<std::mutex> lock(_UserJson->_JsonMutex);
//                                 user.second.get_child("list_serv").erase(it);
//                                 _UserJson->update_json_file();
//                             }
//                             _listServ.erase(serverId);
//
//                             std::cout << "Server ID " << serverId << " removed from User ID " << _id << std::endl;
//                             send_message("200 chat removed from client list\n");
//                             break;
//                         }
//                     }
//                 }
//             }
//         }
//     } catch (const std::exception& e) {
//         std::cerr << "Error deleting server: " << e.what() << std::endl;
//         send_message("400 error during deletion of server\n");
//     }
// }
//
// void Client::deleteChat(std::vector<std::string> args)
// {
//     try {
//         int idServ = std::stoi(args[0]);
//         int chatId = std::stoi(args[1]);
//         bool chatFound = false;
//         std::cout << "I'm out\n"
//                   << std::flush;
//
//         if (idServ == -1 || _listServ.find(idServ) != _listServ.end()) {
//             if (std::find(_listChats.begin(), _listChats.end(), std::stoi(args[1])) != _listChats.end()) {
//                 std::cout << "I'm in\n"
//                           << std::flush;
//                 // Remove chat from server's chat list
//                 for (auto& server : _ServerJson->getJson().get_child("servers")) {
//                     std::cout << "oui\n";
//                     for (auto it = server.second.get_child("chats").begin(); it != server.second.get_child("chats").end(); ++it) {
//                         std::cout << "test\n";
//                         std::cout << "non" << it->second.data() << "\n";
//                         if (it->second.data() == std::to_string(chatId)) {
//                             // Chat found in server, erase it
//                             {
//                                 std::lock_guard<std::mutex> lock(_ServerJson->_JsonMutex);
//                                 server.second.get_child("chats").erase(it);
//                                 _ServerJson->update_json_file();
//                             }
//
//                             chatFound = true;
//                             std::cout << "Chat ID " << chatId << " removed from Server ID " << server.second.get<int>("id") << std::endl;
//                             send_message("200 chat removed from server\n");
//                             break;
//                         }
//                     }
//
//                     if (chatFound)
//                         break;
//                 }
//
//                 if (!chatFound && idServ != -1) {
//                     std::cerr << "Chat ID " << chatId << " not found in any server." << std::endl;
//                     send_message("400 chat not found in any server\n");
//                     return;
//                 }
//
//                 // Remove chat from user’s chat list
//                 for (auto& user : _UserJson->getJson().get_child("users")) {
//                     if (user.second.get<int>("id") == _id) {
//                         for (auto it = user.second.get_child("list_chats").begin(); it != user.second.get_child("list_chats").end(); ++it) {
//                             if (it->second.data() == std::to_string(chatId)) {
//                                 // Chat found in user, erase it
//                                 {
//                                     std::lock_guard<std::mutex> lock(_UserJson->_JsonMutex);
//                                     user.second.get_child("list_chats").erase(it);
//                                     _UserJson->update_json_file();
//                                 }
//                                 _listChats.erase(std::remove(_listChats.begin(), _listChats.end(), chatId), _listChats.end());
//
//                                 std::cout << "Chat ID " << chatId << " removed from User ID " << _id << std::endl;
//                                 send_message("200 chat removed from client list\n");
//                                 break;
//                             }
//                         }
//                     }
//                 }
//
//                 // Remove chat from global list of chats
//                 {
//                     std::lock_guard<std::mutex> lock(_ChatsJson->_JsonMutex);
//                     bool chatRemoved = false;
//                     for (auto it = _ChatsJson->getJson().get_child("chats").begin(); it != _ChatsJson->getJson().get_child("chats").end(); ++it) {
//                         if (it->second.get<int>("id") == chatId) {
//                             // Chat found in chats list, erase it
//                             _ChatsJson->getJson().get_child("chats").erase(it);
//                             _ChatsJson->getJson().put("nb_chat", _ChatsJson->getJson().get<int>("nb_chat") - 1);
//                             _ChatsJson->update_json_file();
//                             chatRemoved = true;
//                             std::cout << "Chat ID " << chatId << " removed from global chat list\n";
//                             send_message("200 chat removed from global list\n");
//                             break;
//                         }
//                     }
//
//                     if (!chatRemoved) {
//                         std::cerr << "Chat ID " << chatId << " not found in global list." << std::endl;
//                         send_message("400 chat not found in global list\n");
//                         return;
//                     }
//                 }
//
//                 // Delete the chat file from the database
//                 std::string path = "../Database/Chats/" + std::to_string(chatId) + ".json";
//                 if (std::remove(path.c_str()) == 0) {
//                     std::cout << "Chat file " << path << " deleted successfully.\n";
//                     send_message("200 chat file deleted from database\n");
//                 } else {
//                     std::cerr << "Error deleting chat file " << path << "\n";
//                     send_message("400 error deleting chat file from database\n");
//                 }
//             }
//         } else
//             send_message("400 error during chat deletion no right\n");
//
//         for (const auto& pair : _listServ) {
//             std::cout << "Key: " << pair.first << ", Value: " << pair.second << std::endl;
//         }
//     } catch (const std::exception& e) {
//         std::cerr << "Error deleting chat at line " << __LINE__ << ": " << e.what() << std::endl;
//         send_message("400 error during chat deletion\n");
//     }
// }
//
// void Client::joinServer(std::vector<std::string> args)
// {
//     try {
//         bool serverFound = false;
//         boost::property_tree::ptree nbChatsNode;
//         boost::property_tree::ptree nbChatsNode2;
//         int id;
//
//         std::cout << "[" << strip(mergeStringsExceptFirst(args, 0)) << "]\n";
//
//         for (auto& server : _ServerJson->getJson().get_child("servers")) {
//             if (server.second.get<std::string>("invite") == strip(mergeStringsExceptFirst(args, 0))) {
//                 // Server found, add chatId to its chats list
//                 id = server.second.get<int>("id");
//                 nbChatsNode.put("", _id);
//                 nbChatsNode2.put("", id);
//                 {
//                     std::lock_guard<std::mutex> lock(_ServerJson->_JsonMutex);
//                     server.second.get_child("aut_user").push_back(std::make_pair("", nbChatsNode));
//                     _ServerJson->update_json_file();
//                 }
//
//                 // Indicate that the server was found and updated
//                 serverFound = true;
//                 std::cout << "User ID " << _id << " join Server ID " << id << std::endl;
//                 send_message("200 join server\n");
//                 _listServ[id] = server.second.get<std::string>("name");
//                 break;
//             }
//         }
//         if (serverFound)
//             for (auto& server : _UserJson->getJson().get_child("users")) {
//                 if (server.second.get<int>("id") == _id) {
//                     // Server found, add chatId to its chats list
//                     {
//                         std::lock_guard<std::mutex> lock(_UserJson->_JsonMutex);
//                         server.second.get_child("list_serv").push_back(std::make_pair("", nbChatsNode2));
//                         _UserJson->update_json_file();
//                     }
//
//                     // Indicate that the server was found and updated
//                     std::cout << "Server ID " << id << " added to settings" << std::endl;
//                     send_message("200 added to client settings\n");
//                     break;
//                 }
//             }
//         else
//             send_message("401 error during join of server\n");
//
//     } catch (const std::exception& e) {
//         std::cerr << "Error adding new server: " << e.what() << std::endl;
//         send_message("400 error during join of server\n");
//     }
// }
//
// void Client::joinChat(std::vector<std::string> args)
// {
//     try {
//         int idServ = std::stoi(args[0]);
//         if (idServ == -1 || _listServ.find(idServ) != _listServ.end()) {
//
//             bool serverFound = false;
//             boost::property_tree::ptree nbChatsNode;
//             boost::property_tree::ptree nbChatsNode2;
//             int id;
//
//             for (auto& chat : _ChatsJson->getJson().get_child("chats")) {
//                 if (chat.second.get<std::string>("invite") == strip(mergeStringsExceptFirst(args, 1))) {
//                     // Server found, add chatId to its chats list
//                     id = chat.second.get<int>("id");
//                     nbChatsNode.put("", _id);
//                     nbChatsNode2.put("", id);
//                     {
//                         std::lock_guard<std::mutex> lock(_ChatsJson->_JsonMutex);
//                         chat.second.get_child("aut_user").push_back(std::make_pair("", nbChatsNode));
//                         _ChatsJson->update_json_file();
//                     }
//
//                     // Indicate that the server was found and updated
//                     serverFound = true;
//                     std::cout << "User ID " << _id << " join Chat ID " << id << std::endl;
//                     send_message("200 join chat\n");
//                     _listChats.push_back(id);
//                     break;
//                 }
//             }
//             if (serverFound)
//                 for (auto& server : _UserJson->getJson().get_child("users")) {
//                     if (server.second.get<int>("id") == _id) {
//                         // Server found, add chatId to its chats list
//                         {
//                             std::lock_guard<std::mutex> lock(_UserJson->_JsonMutex);
//                             server.second.get_child("list_chats").push_back(std::make_pair("", nbChatsNode2));
//                             _UserJson->update_json_file();
//                         }
//
//                         // Indicate that the server was found and updated
//                         std::cout << "Chat ID " << id << " added to settings" << std::endl;
//                         send_message("200 added to client settings\n");
//                         break;
//                     }
//                 }
//             else
//                 send_message("400 error during join of chat\n");
//         } else {
//             send_message("400 no right to join this server chat\n");
//         }
//
//     } catch (const std::exception& e) {
//         std::cerr << "Error adding new server: " << e.what() << std::endl;
//         send_message("400 error during join of server\n");
//     }
// }
//
// BROADCAST_ARGS Client::handleCommand(std::string msg)
// {
//     try {
//         auto [opcode, arguments] = splitOpcodeAndArguments(msg);
//         std::cout << "Message from " << _endp.address().to_string() << ":" << _endp.port() << std::endl;
//
//         std::cout << "Opcode : " << opcode << std::endl;
//         std::cout << "Args:";
//
//         for (auto ms : arguments)
//             std::cout << " " << ms;
//         std::cout << std::endl;
//
//         if (_connected && opcode != 0)
//             switch (opcode) {
//             case 1:
//                 disconectClient(arguments);
//                 break;
//             case 2:
//                 addNewUser(arguments);
//                 break;
//             case 3:
//                 return sendMessageOnChat(arguments);
//             case 4:
//                 getListChat(arguments);
//                 break;
//             case 5:
//                 getListServer(arguments);
//                 break;
//             case 6:
//                 return modifyMessage(arguments);
//             case 7:
//                 getListMessages(arguments);
//                 break;
//             case 8:
//                 createServer(arguments);
//                 break;
//             case 9:
//                 createChat(arguments);
//                 break;
//             case 10:
//                 deleteServer(arguments);
//                 break;
//             case 11:
//                 deleteChat(arguments);
//                 break;
//             case 12:
//                 joinServer(arguments);
//                 break;
//             case 13:
//                 joinChat(arguments);
//                 break;
//             default:
//                 break;
//             }
//         else
//             switch (opcode) {
//             case 0:
//                 tryConnectClient(arguments);
//                 break;
//             case 2:
//                 addNewUser(arguments);
//                 break;
//             default:
//                 send_message("404 Not connected\n");
//                 break;
//             }
//
//     } catch (const std::exception& e) {
//         std::cerr << "Exception in client handler thread: " << e.what() << std::endl;
//     }
//
//     return std::make_tuple<std::vector<int>, bool, std::string>({}, false, "");
// }

#include "Client.hpp"
#include <boost/property_tree/ptree.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <iostream>
#include <exception>
#include <mutex>
#include <algorithm>
#include <fstream>

// Constructor
Client::Client(int id, const std::string& address, const std::string& port, boost::asio::io_context& io_context)
    : _id(id), _address(address), _port(port), _connected(false), _ws(io_context) {
    // Initialize JSON handler objects (_ServerJson, _UserJson, _ChatsJson) here
    _UserJson = std::make_shared<JsonFile>("../Database/User.json");
    _ChatsJson = std::make_shared<JsonFile>("../Database/Chats.json");
    _ServerJson = std::make_shared<JsonFile>("../Database/Servers.json");
}

// Destructor
Client::~Client() {
    // Clean up resources if necessary
}

// Helper Methods
std::string Client::strip(const std::string& str) {
    // Implement stripping whitespace
    return str;
}

std::string Client::mergeStringsExceptFirst(const std::vector<std::string>& args, int index) {
    // Implement merging strings from args starting at the given index
    std::string merged;
    for (size_t i = index; i < args.size(); ++i) {
        if (i != index) merged += " ";
        merged += args[i];
    }
    return merged;
}

std::pair<int, std::vector<std::string>> Client::splitOpcodeAndArguments(const std::string& msg) {
    // Split the message into opcode and arguments
    size_t firstSpace = msg.find(' ');
    int opcode = std::stoi(msg.substr(0, firstSpace));
    std::vector<std::string> arguments;
    size_t lastPos = firstSpace + 1;
    while (lastPos != std::string::npos) {
        size_t nextSpace = msg.find(' ', lastPos);
        if (nextSpace == std::string::npos) {
            arguments.push_back(msg.substr(lastPos));
            break;
        }
        arguments.push_back(msg.substr(lastPos, nextSpace - lastPos));
        lastPos = nextSpace + 1;
    }
    return {opcode, arguments};
}

void Client::send_message(const std::string& message) {
    // Implement sending a message back to the client
    std::cout << message << std::endl;
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

void Client::_setupServerJson(const boost::property_tree::ptree& user)
{
    auto listServId = getListAsVector(user, "list_serv");

    for (const auto& serverNode : _ServerJson->getJson().get_child("servers")) {
        const auto& server = serverNode.second;

        // Get the server ID and name
        int id = server.get<int>("id");
        std::string name = server.get<std::string>("name");

        // Check if the ID is in the provided vector
        if (std::find(listServId.begin(), listServId.end(), id) != listServId.end())
            _listServ[id] = name;
    }
}

void Client::tryConnectClient(std::vector<std::string> args) {
    if (args.size() >= 2) {
        for (const auto& user : _UserJson->getJson().get_child("users")) {
            std::string userName = user.second.get<std::string>("name");
            std::string userPassword = user.second.get<std::string>("password");

            // Check if the name and password match
            if (userName == args[0] && userPassword == args[1]) {
                _connected = true;
                _name = userName;
                _id = user.second.get<int>("id");
                _setupServerJson(user.second);
                _listChats = getListAsVector(user.second, "list_chats");

                send_message("200 You are connected\n");
                return; // Exit the function after successful connection
            }
        }
    }
    if (!_connected) {
        send_message("404 User not found\n");
    }
}

// Command Handlers
std::tuple<std::vector<int>, std::vector<std::shared_ptr<Client>>, std::string> Client::handleCommand(std::string msg) {
    try {
        auto [opcode, arguments] = splitOpcodeAndArguments(msg);
        std::cout << "Message from " << _endp.address().to_string() << ":" << _endp.port() << std::endl;

        std::cout << "Opcode: " << opcode << std::endl;
        std::cout << "Args:";
        for (auto ms : arguments)
            std::cout << " " << ms;
        std::cout << std::endl;

        std::vector<int> client_ids_to_send;
        std::vector<std::shared_ptr<Client>> banned_clients;
        std::string response_message;

        if (_connected && opcode != 0) {
            switch (opcode) {
                case 1:
                    disconectClient(arguments);
                    break;
                case 2:
                    addNewUser(arguments);
                    break;
                case 3:
                    sendMessageOnChat(arguments);
                    break;
                case 4:
                    getListChat(arguments);
                    break;
                case 5:
                    getListServer(arguments);
                    break;
                case 6:
                    // modifyMessage(arguments);
                    break;
                case 7:
                    // getListMessages(arguments);
                    break;
                case 8:
                    // createServer(arguments);
                    break;
                case 9:
                    // createChat(arguments);
                    break;
                case 10:
                    // deleteServer(arguments);
                    break;
                case 11:
                    // deleteChat(arguments);
                    break;
                case 12:
                    // joinServer(arguments);
                    break;
                case 13:
                    // joinChat(arguments);
                    break;
                default:
                    break;
            }
        } else {
            switch (opcode) {
                case 0:
                    tryConnectClient(arguments);
                    break;
                case 2:
                    addNewUser(arguments);
                    break;
                default:
                    send_message("404 Not connected\n");
                    response_message = "404 Not connected";
                    break;
            }
        }

        // Return a tuple: {client_ids_to_send, banned_clients, response_message}
        return std::make_tuple(client_ids_to_send, banned_clients, response_message);

    } catch (const std::exception& e) {
        std::cerr << "Exception in client handler thread: " << e.what() << std::endl;
        // Return empty tuple on error
        return std::make_tuple(std::vector<int>{}, std::vector<std::shared_ptr<Client>>{}, "Error: " + std::string(e.what()));
    }
}

void Client::disconectClient(std::vector<std::string> args) {
    // Handle disconnection
}

void Client::addNewUser(std::vector<std::string> args) {
    try {
        boost::property_tree::ptree newUser;
        newUser.put("id", std::stoi(args[0]));
        newUser.put("name", args[1]);
        newUser.put("email", args[2]);

        {
            std::lock_guard<std::mutex> lock(_JsonMutex);
            _UserJson->getJson().get_child("users").push_back(std::make_pair("", newUser));
            _UserJson->update_json_file();
        }

        send_message("200 User added successfully\n");
    } catch (const std::exception& e) {
        std::cerr << "Error adding new user: " << e.what() << std::endl;
        send_message("400 error adding user\n");
    }
}

void Client::sendMessageOnChat(std::vector<std::string> args) {
    try {
        int chatId = std::stoi(args[0]);
        std::string message = mergeStringsExceptFirst(args, 1);

        if (std::find(_listChats.begin(), _listChats.end(), chatId) != _listChats.end()) {
            // Logic to send a message to the chat

            std::cout << "Message sent to chat ID " << chatId << ": " << message << std::endl;
            send_message("200 Message sent to chat\n");
        } else {
            send_message("400 Error: Not a member of the chat\n");
        }
    } catch (const std::exception& e) {
        std::cerr << "Error sending message: " << e.what() << std::endl;
        send_message("400 error sending message\n");
    }
}

void Client::getListChat(std::vector<std::string> args) {
    try {
        std::cout << "Listing chats for client ID " << _id << std::endl;
        for (auto chatId : _listChats) {
            std::cout << "Chat ID: " << chatId << std::endl;
        }

        send_message("200 List of chats sent\n");
    } catch (const std::exception& e) {
        std::cerr << "Error getting list of chats: " << e.what() << std::endl;
        send_message("400 error retrieving chat list\n");
    }
}

void Client::getListServer(std::vector<std::string> args) {
    try {
        std::cout << "Listing servers for client ID " << _id << std::endl;
        for (const auto& server : _listServ) {
            std::cout << "Server ID: " << server.first << ", Name: " << server.second << std::endl;
        }

        send_message("200 List of servers sent\n");
    } catch (const std::exception& e) {
        std::cerr << "Error getting list of servers: " << e.what() << std::endl;
        send_message("400 error retrieving server list\n");
    }
}
