import { User } from "@/types/IUser";
import { Message } from "@/types/IMessage";
import { useState, useEffect } from "react";
import { UserAuth } from "@/types/IUserAuth";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "@/components/Themed";
import { Button, Image, TextInput } from "react-native";

export default function ChatPage() {
    const [input, setInput] = useState<string>("");
    const [serverMessage, setServerMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

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
            <View className="flex-row justify-center p-4 text-center align-middle">
                <Image
                    source={{ uri: users[0].imageUri }}
                    className="mr-2 h-12 w-12 rounded-full"
                />
                <div className="ml-4 flex flex-col justify-center align-middle">
                    <Text className="text-xl font-bold">{users[0].name}</Text>
                </div>
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
                                <div className="flex w-full flex-col gap-3">
                                    <Text>{message.content}</Text>
                                    <div className="flex w-full flex-row justify-end gap-2">
                                        <Text className="text-right text-xs text-gray-100">
                                            {new Date(
                                                message.createdAt,
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Text>
                                        <Ionicons
                                            name="checkmark-done"
                                            size={16}
                                            color="white"
                                        />
                                    </div>
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
                                <div className="flex w-full flex-col gap-3">
                                    <Text>{message.content}</Text>
                                    <div className="flex w-full flex-row justify-end gap-2">
                                        <Text className="text-right text-xs text-gray-100">
                                            {
                                                // Only show hours and minutes
                                                new Date(
                                                    message.createdAt,
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                            }
                                        </Text>
                                        <Ionicons
                                            name="checkmark-done"
                                            size={16}
                                            color="white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </View>
                    );
                })}
            </View>
            <div className="flex w-full border-t-2 border-slate-800">
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
