import { useRouter } from "expo-router";
import { UserChat } from "@/types/IUserChat";
import { Text, View } from "@/components/Themed";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
    const router = useRouter();

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
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/bill_gates.jpg",
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

    return (
        <View className="flex-1">
            <View className="p-4">
                <Text className="text-lg font-bold">Connected Players:</Text>
                {chats.map(
                    (chat, index) =>
                        chat.isConnected && (
                            <View
                                key={"Player connected number " + index}
                                className="ml-4 flex-row items-center p-2"
                            >
                                <Image
                                    source={{ uri: chat.imageUri }}
                                    className="mr-4 h-10 w-10 rounded-full"
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
                                    source={{ uri: chat.imageUri }}
                                    className="mr-4 h-10 w-10 rounded-full"
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
