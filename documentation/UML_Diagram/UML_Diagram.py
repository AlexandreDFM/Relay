from graphviz import Digraph

# Create UML Class Diagram
class_diagram = Digraph('ClassDiagram', format='png')
class_diagram.attr(rankdir='BT', fontsize='12')

# Define classes for the UML class diagram
classes = {
    "User": {
        "attributes": ["userID", "username", "email", "status"],
        "methods": ["login()", "logout()", "updateStatus()"]
    },
    "ChatRoom": {
        "attributes": ["chatRoomID", "chatRoomName", "members", "messages"],
        "methods": ["addMember(User)", "removeMember(User)", "sendMessage(Message)"]
    },
    "Message": {
        "attributes": ["messageID", "content", "timestamp", "sender"],
        "methods": ["createMessage()", "editMessage()", "deleteMessage()"]
    },
    "VideoStream": {
        "attributes": ["streamID", "streamer", "viewers", "streamData"],
        "methods": ["startStream()", "stopStream()", "addViewer(User)"]
    },
    "Server": {
        "attributes": ["serverID", "activeUsers", "activeChatRooms", "database"],
        "methods": ["createChatRoom()", "removeChatRoom()", "manageConnections()"]
    },
    "Database": {
        "attributes": ["dataStore"],
        "methods": ["storeMessage(Message)", "retrieveMessages(ChatRoom)", "updateUserData(User)"]
    }
}

# Add classes to diagram
for class_name, elements in classes.items():
    attributes = "\l".join(elements["attributes"]) + "\l"
    methods = "\l".join(elements["methods"]) + "\l"
    class_diagram.node(class_name, f"{class_name}\n\n{attributes}\n{methods}", shape='record')

# Define relationships
class_diagram.edge("User", "ChatRoom", label="joins", arrowhead="vee")
class_diagram.edge("User", "Message", label="sends", arrowhead="vee")
class_diagram.edge("User", "VideoStream", label="views", arrowhead="vee")
class_diagram.edge("Message", "ChatRoom", label="sent to", arrowhead="vee")
class_diagram.edge("ChatRoom", "Server", label="hosted by", arrowhead="vee")
class_diagram.edge("Server", "Database", label="accesses", arrowhead="vee")

# Generate UML Class Diagram
class_diagram_path = 'c:\\Users\\AlexandreDFM\\desktop\\UML_Class_Diagram.pngUML_Class_Diagram.png'
class_diagram.render(filename=class_diagram_path)

# Create UML Activity Diagram
activity_diagram = Digraph('ActivityDiagram', format='png')
activity_diagram.attr(rankdir='TB', fontsize='12')

# Define Activity Diagram nodes
activity_diagram.attr('node', shape='ellipse')
activity_diagram.node("Start", "Start")
activity_diagram.node("Login", "User Login")
activity_diagram.node("Verify", "System Verifies Credentials")
activity_diagram.node("Join", "User Joins ChatRoom")
activity_diagram.node("Send", "User Sends Message")
activity_diagram.node("Store", "Store Message in Database")
activity_diagram.node("Display", "Display Message to All Users")
activity_diagram.node("End", "End")

# Define Activity Diagram transitions
activity_diagram.edge("Start", "Login")
activity_diagram.edge("Login", "Verify")
activity_diagram.edge("Verify", "Join")
activity_diagram.edge("Join", "Send")
activity_diagram.edge("Send", "Store")
activity_diagram.edge("Store", "Display")
activity_diagram.edge("Display", "End")

# Generate UML Activity Diagram
activity_diagram_path = 'c:\\Users\\AlexandreDFM\\desktop\\UML_Class_Diagram.png'
activity_diagram.render(filename=activity_diagram_path)

class_diagram_path, activity_diagram_path
