import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

interface Message {
    id: string;
    content: string;
    createdAt: string;
}

interface UserChat {
    id: string;
    name: string;
    imageUri: string;
    messages: Message[];
}

export default function TabOneScreen() {
    const router = useRouter();

    const chats: UserChat[] = [
        {
            id: "1",
            name: "Mark Zuckerberg",
            imageUri:
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg",
            messages: [
                {
                    id: "1",
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
            messages: [
                {
                    id: "1",
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
            messages: [
                {
                    id: "1",
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
            messages: [
                {
                    id: "1",
                    content: "I'm donating 50 billion dollars",
                    createdAt: "2021-09-15T12:48:00.000Z",
                },
            ],
        },
    ];

    const handlePress = (chatId: string) => {
        router.push("/(tabs)/chat");
        // console.log(`Chat with ID ${chatId} clicked!`);
    };

    return (
        <View className="flex-1">
            {chats &&
                chats.map((chat) => (
                    <TouchableOpacity
                        key={chat.id}
                        onPress={() => handlePress(chat.id)}
                        activeOpacity={0.7}
                    >
                        <View key={chat.id} className="w-full">
                            <View
                                key={chat.id}
                                className="w-full flex-row align-middle p-4"
                            >
                                <Image
                                    source={{ uri: chat.imageUri }}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <View className="w-full">
                                    <View className="pr-20 flex-row">
                                        <Text className="font-bold text-xl">
                                            {chat.name}
                                        </Text>
                                        <Text className="ml-auto text-gray-400 font-light text-sm">
                                            {chat.messages[0].createdAt}
                                        </Text>
                                    </View>
                                    <Text>{chat.messages[0].content}</Text>
                                </View>
                            </View>
                            <View
                                className="my-1 w-full h-1"
                                key={chat.id}
                                lightColor="#eee"
                                darkColor="rgba(255,255,255,0.1)"
                            />
                        </View>
                    </TouchableOpacity>
                ))}
        </View>
    );
}
