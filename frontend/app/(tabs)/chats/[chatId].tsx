import { useState, useEffect, useRef } from "react";
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

type UserField = "message" | "status";

export default function ChatPage() {
    const route = useRoute();
    const { user } = useAuth();
    const { isLogged } = useAuth();
    const scrollViewRef = useRef<ScrollView>(null);
    const [input, setInput] = useState<string>("");
    const { isConnected, broadcast } = useWebSocket();
    const { chatId } = route.params as { chatId: string };
    const [editInput, setEditInput] = useState<string>("");
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [editingField, setEditingField] = useState<UserField | null>(null);
    const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>();
    const { getChannelMessages, sendMessageOnServer, modifyMessageOnServer } =
        useServerManager();

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

        setTimeout(() => {
            fetchMessages();
        }, 1000);
    };

    const modifyMessage = async ({ index }: { index: number }) => {
        const response = await modifyMessageOnServer(
            0,
            parseInt(chatId),
            index,
            editInput,
        );
        setEditInput("");
        setEditingField(null);
        setEditingFieldIndex(null);
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

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, []);

    useEffect(() => {
        if (broadcast !== "") {
            // Update messages
            const fetchMessages = async () => {
                const messages = await getChannelMessages(
                    0,
                    parseInt(chatId),
                    99,
                );

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
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime()
                        );
                    });

                    return groupedMessages;
                };
                setMessages(groupMessages(messages));
            };
            fetchMessages();
        }
    }, [broadcast]);

    return (
        <View className="flex-1">
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 pt-2" edges={["top"]}>
                    <ScrollView
                        ref={scrollViewRef}
                        onContentSizeChange={() =>
                            scrollViewRef.current?.scrollToEnd({
                                animated: true,
                            })
                        }
                    >
                        {messages.length === 0 ? (
                            <View className="flex-row p-4 align-middle">
                                <Text>No messages</Text>
                            </View>
                        ) : (
                            messages.map((message, index) => {
                                return user?.id.toLocaleString() ===
                                    message.author ? (
                                    editingField === "message" &&
                                    index === editingFieldIndex ? (
                                        <View
                                            key={"Message Sended View " + index}
                                            className="w-full flex-row p-4 align-middle"
                                        >
                                            <div
                                                key={
                                                    "Message Sended Div " +
                                                    index
                                                }
                                                className="ml-auto w-1/2 flex-row justify-end rounded-lg bg-blue-700 p-4 align-middle"
                                            >
                                                <div className="flex w-full flex-row gap-3">
                                                    <div className="flex-grow">
                                                        <TextInput
                                                            value={editInput}
                                                            onChangeText={(
                                                                text,
                                                            ) =>
                                                                setEditInput(
                                                                    text,
                                                                )
                                                            }
                                                            onKeyPress={(e) =>
                                                                e.nativeEvent
                                                                    .key ===
                                                                    "Enter" &&
                                                                modifyMessage({
                                                                    index,
                                                                })
                                                            }
                                                            className="w-full rounded-md p-2"
                                                        />
                                                        <Button
                                                            title="Send"
                                                            onPress={() =>
                                                                modifyMessage({
                                                                    index,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex h-full flex-shrink flex-col justify-end gap-2">
                                                        <div className="flex w-full flex-row justify-end gap-2">
                                                            <Pressable
                                                                className="items-center justify-center rounded-full align-middle"
                                                                onPress={() =>
                                                                    setEditingField(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                {({
                                                                    pressed,
                                                                }) => (
                                                                    <Ionicons
                                                                        name="ellipsis-vertical"
                                                                        size={
                                                                            24
                                                                        }
                                                                        color="white"
                                                                        style={{
                                                                            opacity:
                                                                                pressed
                                                                                    ? 0.5
                                                                                    : 1,
                                                                        }}
                                                                    />
                                                                )}
                                                            </Pressable>
                                                        </div>
                                                        <div className="justify-end">
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
                                            </div>
                                        </View>
                                    ) : (
                                        <View
                                            key={"Message Sended View " + index}
                                            className="w-full flex-row p-4 align-middle"
                                        >
                                            <div
                                                key={
                                                    "Message Sended Div " +
                                                    index
                                                }
                                                className="ml-auto w-1/2 flex-row justify-end rounded-lg bg-blue-700 p-4 align-middle"
                                            >
                                                <div className="flex w-full flex-row gap-3">
                                                    <div className="flex-grow">
                                                        <Text>
                                                            {message.content}
                                                        </Text>
                                                    </div>
                                                    <div className="flex h-full flex-shrink flex-col justify-end gap-2">
                                                        <div className="flex w-full flex-row justify-end gap-2">
                                                            <Pressable
                                                                className="items-center justify-center rounded-full align-middle"
                                                                onPress={() => {
                                                                    setEditingField(
                                                                        "message",
                                                                    );
                                                                    setEditingFieldIndex(
                                                                        index,
                                                                    );
                                                                    setEditInput(
                                                                        message.content,
                                                                    );
                                                                }}
                                                            >
                                                                {({
                                                                    pressed,
                                                                }) => (
                                                                    <Ionicons
                                                                        name="pencil"
                                                                        size={
                                                                            24
                                                                        }
                                                                        color="white"
                                                                        style={{
                                                                            opacity:
                                                                                pressed
                                                                                    ? 0.5
                                                                                    : 1,
                                                                        }}
                                                                    />
                                                                )}
                                                            </Pressable>
                                                        </div>
                                                        <div className="justify-end">
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
                                            </div>
                                        </View>
                                    )
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
