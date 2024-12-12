import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { MessageData } from "@/types/IMessageData";
import { useRoute } from "@react-navigation/native";
import useServerManager from "@/hook/useServerManager";
import { useWebSocket } from "@/context/WebsocketProvider";
import { Button, TextInput, ScrollView, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
    layout: null, // Bypass the default layout
};

export default function ChatPage() {
    const route = useRoute();
    const { user } = useAuth();
    const { isLogged } = useAuth();
    const { isConnected } = useWebSocket();
    const [input, setInput] = useState<string>("");
    const { chatId } = route.params as { chatId: string };
    const [messages, setMessages] = useState<MessageData[]>([]);
    const { getChannelMessages, sendMessageOnServer } = useServerManager();

    useEffect(() => {
        const fetchMessages = async () => {
            const messages = await getChannelMessages(0, parseInt(chatId), 99);

            const groupMessages = (messages: string[]) => {
                const groupedMessages: MessageData[] = [];
                for (let i = 0; i < messages.length; i++) {
                    const message = messages[i].split("/");
                    groupedMessages.push({
                        content: message[0],
                        date: message[1],
                        author: message[2],
                    });
                }

                groupedMessages.sort((a, b) => {
                    return (
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    );
                });

                return groupedMessages;
            };

            setMessages(groupMessages(messages));
        };

        fetchMessages();
    }, [isLogged, isConnected]);

    const sendMessage = async () => {
        const response = await sendMessageOnServer(0, parseInt(chatId), input);
        console.log("On send message, Server says : ", response);
        setInput("");

        // Update messages
        const fetchMessages = async () => {
            const messages = await getChannelMessages(0, parseInt(chatId), 99);

            const groupMessages = (messages: string[]) => {
                const groupedMessages: MessageData[] = [];
                for (let i = 0; i < messages.length; i++) {
                    const message = messages[i].split("/");
                    groupedMessages.push({
                        content: message[0],
                        date: message[1],
                        author: message[2],
                    });
                }

                groupedMessages.sort((a, b) => {
                    return (
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    );
                });

                return groupedMessages;
            };

            setMessages(groupMessages(messages));
        };

        fetchMessages();
    };

    return (
        <View className="flex-1">
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 pt-2" edges={["top"]}>
                    <ScrollView>
                        {messages.length === 0 ? (
                            <View className="flex-row p-4 align-middle">
                                <Text>No messages</Text>
                            </View>
                        ) : (
                            messages.map((message, index) => {
                                return user?.id.toLocaleString() ===
                                    message.author ? (
                                    <View
                                        key={"Message Sended View " + index}
                                        className="w-full flex-row p-4 align-middle"
                                    >
                                        <div
                                            key={"Message Sended Div " + index}
                                            className="ml-auto w-1/2 flex-row justify-end rounded-lg bg-blue-700 p-4 align-middle"
                                        >
                                            <div className="flex w-full flex-col gap-3">
                                                <Text>{message.content}</Text>
                                                <div className="flex w-full flex-row justify-end gap-2">
                                                    <Text className="text-right text-xs text-gray-100">
                                                        {new Date(
                                                            message.date,
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            },
                                                        )}
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
                                        key={"Message Received View " + index}
                                        className="w-full flex-row p-4 align-middle"
                                    >
                                        <div
                                            key={
                                                "Message Received Div " + index
                                            }
                                            className="flex w-1/2 flex-row rounded-lg bg-gray-500 p-4 align-middle"
                                        >
                                            <div className="flex w-full flex-col gap-3">
                                                <Text>{message.content}</Text>
                                                <div className="flex w-full flex-row justify-end gap-2">
                                                    <Text className="text-right text-xs text-gray-100">
                                                        {new Date(
                                                            message.date,
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            },
                                                        )}
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
                            })
                        )}
                    </ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
            <div className="flex w-full border-t-2 border-slate-200">
                <Pressable className="items-center justify-center rounded-full bg-slate-400 align-middle">
                    {({ pressed }) => (
                        <Ionicons
                            name="attach"
                            size={24}
                            style={{
                                opacity: pressed ? 0.5 : 1,
                            }}
                        />
                    )}
                </Pressable>
                <TextInput
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    placeholder="Type a message"
                    className="w-4 flex-1 rounded-md p-2"
                    onKeyPress={(e) =>
                        e.nativeEvent.key === "Enter" && sendMessage()
                    }
                />
                <Button title="Send" onPress={sendMessage} />
            </div>
        </View>
    );
}
