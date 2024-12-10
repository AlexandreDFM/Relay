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
    const [clientlist, setClientList] = useState<string[]>([]);

    const chats: UserChat[] = [
        {
            id: "1",
            name: "Mark Zuckerberg",
            imageUri:
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg",
            isConnected: true,
            messages: [
                {
                    id: "1",
                    userId: "1",
                    content: "How are you doing?",
                    createdAt: "2021-09-15T12:48:00.000Z",
                },
            ],
        },
        {
            id: "2",
            name: "Elon Musk",
            imageUri:
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png",
            isConnected: true,
            messages: [
                {
                    id: "2",
                    userId: "2",
                    content: "I'm in the process of building a rocket",
                    createdAt: "2021-09-15T12:48:00.000Z",
                },
            ],
        },
        {
            id: "3",
            name: "Jeff Bezoz",
            imageUri:
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg",
            isConnected: false,
            messages: [
                {
                    id: "3",
                    userId: "3",
                    content: "I'm stepping down as CEO of Amazon",
                    createdAt: "2021-09-15T12:48:00.000Z",
                },
            ],
        },
        {
            id: "4",
            name: "Bill Gates",
            imageUri:
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg",
            isConnected: false,
            messages: [
                {
                    id: "4",
                    userId: "4",
                    content: "I'm donating 50 billion dollars",
                    createdAt: "2021-09-15T12:48:00.000Z",
                },
            ],
        },
    ];

    useEffect(() => {
        const fetchClientList = async () => {
            if (!isLogged || !isConnected) return;
            const clientlist = await getClientList();
            setClientList(clientlist);
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
                {clientlist.map((client, index) => (
                    <div className="flex flex-row items-center align-middle">
                        <Image
                            source={require("@/assets/images/placeholders/profile_placeholder.png")}
                            style={styles.image}
                        />
                        <Text
                            key={"Client number " + index}
                            className="text-lg"
                        >
                            {client}
                        </Text>
                    </div>
                ))}

                <Text className="text-lg font-bold">Connected Players:</Text>
                {chats.map(
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
                )}
                <Text className="text-lg font-bold">Disconnected Players:</Text>
                {chats.map(
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
                )}
            </View>
        </View>
    );
}
