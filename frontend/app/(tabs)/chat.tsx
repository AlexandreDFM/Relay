import { Image, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

interface Message {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
}

interface User {
    id: string;
    name: string;
    imageUri: string;
}

interface UserChat {
    id: string;
    name: string;
    imageUri: string;
    messages: Message[];
}

export default function TabOneScreen() {
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
        }
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
        }
    ];

    return (
        <View className="flex-1">
            <View className="flex-1 justify-end p-4">
                {chat.map((message) => {
                    const user = users.find((u) => u.id === message.userId);

                    if (!user) return null;

                    return (
                        <View key={message.id} className="w-full flex-row align-middle p-4">
                            <Image
                                source={{ uri: user.imageUri }}
                                className="w-12 h-12 rounded-full mr-4"
                            />

                            <View className="flex-1">
                                <View className="pr-20 flex-row">
                                    <Text className="font-bold text-xl">{user.name}</Text>
                                    <Text className="ml-auto text-gray-400 font-light text-sm">
                                        {new Date(message.createdAt).toLocaleString()}
                                    </Text>
                                </View>
                                <Text>{message.content}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
