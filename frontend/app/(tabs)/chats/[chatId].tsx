import { User } from "@/types/IUser";
import { Message } from "@/types/IMessage";
import { useState, useEffect } from "react";
import { UserAuth } from "@/types/IUserAuth";
import { Text, View } from "@/components/Themed";
import { Button, Image, TextInput } from "react-native";

export default function ChatPage() {
    const [input, setInput] = useState<string>("");
    const [serverMessage, setServerMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:8080");

        ws.onopen = () => {
            ws.send("0\rBob\rpass");
            setIsConnected(true); // Update state to reflect successful connection
        };

        ws.onmessage = (e) => {
            console.log("Message from server:", e.data);
            setServerMessage(e?.data); // Store the server message
        };

        ws.onerror = (e) => {
            console.log("WebSocket error:", e);
            setIsConnected(false); // Update state if there is an error
        };

        ws.onclose = (e) => {
            console.log("WebSocket connection closed:", e.code, e.reason);
            setIsConnected(false); // Update state if the connection closes
        };

        // Clean up WebSocket connection when the component unmounts
        return () => {
            ws.close();
        };
    }, []);

    const users: User[] = [
        {
            id: "1",
            name: "Mark Zuckerberg",
            imageUri:
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg",
        },
        {
            id: "2",
            name: "Elon Musk",
            imageUri:
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png",
        },
    ];

    const chat: Message[] = [
        {
            id: "1",
            userId: "1",
            content: "How are you doing?",
            createdAt: "2021-09-15T12:48:00.000Z",
        },
        {
            id: "2",
            userId: "2",
            content: "Well and you?",
            createdAt: "2021-09-15T12:48:00.000Z",
        },
    ];

    const MyUser: UserAuth = {
        id: "1",
        name: "Mark Zuckerberg",
        imageUri:
            "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg",
        status: "Hey there! I am using WhatsApp",
        email: "test@gmail.com",
        password: "password",
        createdAt: "2021-09-15T12:48:00.000Z",
        updatedAt: "2021-09-15T12:48:00.000Z",
    };

    return (
        <View className="flex-1">
            <View className="flex-row p-4 align-middle">
                <Text style={{ color: "white" }}>
                    {isConnected
                        ? "Connected to WebSocket"
                        : "Not connected to WebSocket"}
                </Text>
                {serverMessage ? (
                    <Text style={{ color: "green" }}>
                        Server: {serverMessage}
                    </Text>
                ) : (
                    <Text style={{ color: "gray" }}>
                        No message from server yet
                    </Text>
                )}
            </View>
            <View className="flex-1 p-4">
                {chat.map((message) => {
                    const user = users.find((u) => u.id === message.userId);

                    if (!user) return null;

                    return message.userId === MyUser.id ? (
                        <View
                            key={"Message Received View" + message.id}
                            className="w-full flex-row p-4 align-middle"
                        >
                            <div
                                key={"Message Received Div" + message.id}
                                className="flex w-1/2 flex-row rounded-lg bg-gray-500 p-4 align-middle"
                            >
                                <Image
                                    source={{ uri: user.imageUri }}
                                    className="mr-2 h-12 w-12 rounded-full"
                                />
                                <div className="ml-4 flex flex-col">
                                    <Text className="text-xl font-bold">
                                        {user.name}
                                    </Text>
                                    <Text>{message.content}</Text>
                                </div>
                            </div>
                        </View>
                    ) : (
                        <View
                            key={"Message Sended View" + message.id}
                            className="w-full flex-row p-4 align-middle"
                        >
                            <div
                                key={"Message Sended Div" + message.id}
                                className="ml-auto w-1/2 flex-row justify-end rounded-lg bg-blue-700 p-4 align-middle"
                            >
                                <div className="flex">
                                    <div className="ml-auto mr-2 flex flex-col text-end">
                                        <Text className="text-xl font-bold">
                                            {user.name}
                                        </Text>
                                        <Text>{message.content}</Text>
                                    </div>
                                    <Image
                                        source={{ uri: user.imageUri }}
                                        className="h-12 w-12 rounded-full"
                                    />
                                </div>
                            </div>
                        </View>
                    );
                })}
            </View>
            <div className="flex w-full">
                <TextInput
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    placeholder="Type a message"
                    className="flex-1 p-2"
                />
                {/* onKeyPress={(e) => e.key === "Enter" && sendMessage()} */}
                {/* // onClick={sendMessage} */}
                <Button title="Send" />
            </div>
        </View>
    );
}
