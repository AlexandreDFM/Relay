// import { io } from "socket.io-client";
import { User } from "@/types/IUser";
import { Button, Image, TextInput } from "react-native";
import { Message } from "@/types/IMessage";
import { useState, useEffect } from "react";
import { Text, View } from "@/components/Themed";
import { UserAuth } from "@/types/IUserAuth";

export default function ChatPage() {
    // const router = useExpoRouter();
    // const { id } = router.query;
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");
    // const socket = io("http://localhost:3000");

    // useEffect(() => {
    //     socket.on("message", (message: string) => {
    //         setMessages((prevMessages) => [...prevMessages, message]);
    //     });

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    // const sendMessage = () => {
    //     if (input.trim()) {
    //         socket.emit("message", input);
    //         setInput("");
    //     }
    // };

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
            <View className="flex-1 p-4">
                {chat.map((message) => {
                    const user = users.find((u) => u.id === message.userId);

                    if (!user) return null;

                    return message.userId === MyUser.id ? (
                        <View
                            key={message.id}
                            className="w-full flex-row p-4 align-middle"
                        >
                            <div
                                key={message.id}
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
                            key={message.id}
                            className="w-full flex-row p-4 align-middle"
                        >
                            <div
                                key={message.id}
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
