import { Image } from "react-native";
import { StyleSheet } from "nativewind";
import { useEffect, useState } from "react";
import { UserChat } from "@/types/IUserChat";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import useServerManager from "@/hook/useServerManager";
import { useWebSocket } from "@/context/WebsocketProvider";

export default function HomeScreen() {
    const { isLogged } = useAuth();
    const { isConnected } = useWebSocket();
    const { getClientList } = useServerManager();
    const [chats, setChats] = useState<UserChat[]>([]);
    const [clientlist, setClientList] = useState<string[]>([]);

    useEffect(() => {
        const fetchClientList = async () => {
            if (!isLogged || !isConnected) return;
            const clientlist = await getClientList();
            setClientList(clientlist);
            const chatsList: UserChat[] = [];
            clientlist.forEach((client) => {
                const chat: UserChat = {
                    id: client,
                    name: client,
                    imageUri: "",
                    isConnected: false,
                    messages: [],
                };
                chatsList.push(chat);
            });
            setChats(chatsList);
        };

        fetchClientList();
    }, [isLogged, isConnected]);

    const styles = StyleSheet.create({
        image: {
            borderRadius: 100,
            marginLeft: 18,
            width: 50,
            height: 50,
        },
    });

    return (
        <View className="flex-1">
            <View className="p-4">
                <Text className="text-lg font-bold">Connected Players:</Text>
                {chats.filter((chat) => chat.isConnected).length > 0 ? (
                    chats.map(
                        (chat, index) =>
                            chat.isConnected && (
                                <View
                                    key={"Player connected number " + index}
                                    className="ml-4 flex-row items-center p-2"
                                >
                                    <Image
                                        source={require("@/assets/images/placeholders/profile_placeholder.png")}
                                        style={{
                                            borderRadius: 100,
                                            width: 50,
                                            height: 50,
                                        }}
                                    />
                                    {chat.isConnected && (
                                        <div className="absolute bottom-2 h-3 w-3 rounded-full border-2 border-black bg-green-500" />
                                    )}
                                    <Text className="text-md">{chat.name}</Text>
                                </View>
                            ),
                    )
                ) : (
                    <View className="ml-4 flex-row items-center p-2">
                        No connected players
                    </View>
                )}
                <Text className="text-lg font-bold">Disconnected Players:</Text>
                {chats.filter((chat) => !chat.isConnected).length > 0 ? (
                    chats.map(
                        (chat, index) =>
                            !chat.isConnected && (
                                <View
                                    key={"Player not connected number " + index}
                                    className="ml-4 flex-row items-center p-2"
                                >
                                    <Image
                                        className="mr-4 rounded-full"
                                        source={require("@/assets/images/placeholders/profile_placeholder.png")}
                                        style={{
                                            borderRadius: 100,
                                            width: 50,
                                            height: 50,
                                        }}
                                    />
                                    {!chat.isConnected && (
                                        <div className="absolute bottom-2 h-3 w-3 rounded-full border-2 border-black bg-red-500" />
                                    )}
                                    <Text className="text-md">{chat.name}</Text>
                                </View>
                            ),
                    )
                ) : (
                    <View className="ml-4 flex-row items-center p-2">
                        No disconnected players
                    </View>
                )}
            </View>
        </View>
    );
}
