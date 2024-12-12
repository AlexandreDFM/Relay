import { useRouter } from "expo-router";
import { StyleSheet } from "nativewind";
import { useEffect, useState } from "react";
import { UserChat } from "@/types/IUserChat";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import useServerManager from "@/hook/useServerManager";
import { Image, TouchableOpacity } from "react-native";
import { useWebSocket } from "@/context/WebsocketProvider";

export default function ChatsScreen() {
    const router = useRouter();
    const { isLogged } = useAuth();
    const { isConnected } = useWebSocket();
    const [chats, setChats] = useState<UserChat[]>([]);
    const [messages, setMessages] = useState<string[][]>([]);
    const { getClientList, getChannelMessages } = useServerManager();
    const [clientlist, setClientList] = useState<string[]>([]);

    const handlePress = (chatId: string) => {
        router.push(`/chats/${chatId}`);
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!isLogged || !isConnected) return;

            const chatMessagesList: string[][] = [];

            for (let i = 0; i < clientlist.length; i++) {
                const messages = await getChannelMessages(1, i, 1);
                chatMessagesList.push(messages);
            }
            setMessages(chatMessagesList);
        };

        const fetchClientList = async () => {
            if (!isLogged || !isConnected) return;
            const clientlist = await getClientList();
            setClientList(clientlist);
            const chats: UserChat[] = clientlist.map((client) => ({
                id: client,
                name: client,
                imageUri: "",
                isConnected: true,
                messages: [],
            }));

            setChats(chats);

            fetchMessages();

            const chatsWithMessages = chats.map((chat, index) => {
                if (messages.length === 0 || messages[index].length === 0)
                    return chat;
                const lastMessage = messages[index][0];
                const messageToStore = lastMessage.split("/");
                if (messageToStore.length < 3) return chat;
                return {
                    ...chat,
                    messages: [
                        {
                            content: messageToStore[0],
                            date: messageToStore[1],
                            author: messageToStore[2],
                        },
                    ],
                };
            });

            setChats(chatsWithMessages);
        };

        fetchClientList();
    }, [isLogged, isConnected]);

    const styles = StyleSheet.create({
        image: {
            borderRadius: 100,
            width: 50,
            height: 50,
        },
    });

    return (
        <View className="flex-1">
            {chats &&
                chats.map((chat, index) => (
                    <TouchableOpacity
                        key={"Touchable Message Chat Number " + index}
                        onPress={() => handlePress(index.toLocaleString())}
                        activeOpacity={0.7}
                    >
                        <View
                            key={"Client " + chat}
                            className="flex-row p-4 align-middle"
                        >
                            <Image
                                source={require("@/assets/images/placeholders/profile_placeholder.png")}
                                style={styles.image}
                            />
                            <View className="w-full">
                                <View className="flex-row pr-16">
                                    <Text className="text-xl font-bold">
                                        {chat.name}
                                    </Text>
                                    <Text className="ml-auto text-sm font-light text-gray-400">
                                        {chat.messages.length > 0
                                            ? new Date(
                                                  chat.messages[0].date,
                                              ).toLocaleTimeString([], {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : ""}
                                    </Text>
                                </View>
                                <Text>
                                    {chat.messages && chat.messages.length > 0
                                        ? chat.messages[0].content
                                        : "No messages"}
                                </Text>
                            </View>
                        </View>
                        <View
                            className="my-1 h-1 w-full"
                            key={"Nessage Chat separator number " + index}
                            lightColor="#eee"
                            darkColor="rgba(255,255,255,0.1)"
                        />
                    </TouchableOpacity>
                ))}
        </View>
    );
}
