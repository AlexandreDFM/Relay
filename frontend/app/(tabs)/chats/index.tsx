import { useRouter } from "expo-router";
import { UserChat } from "@/types/IUserChat";
import { Text, View } from "@/components/Themed";
import { Image, TouchableOpacity } from "react-native";

export default function ChatsScreen() {
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
                    id: "1",
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
                    id: "1",
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
                    id: "1",
                    userId: "4",
                    content: "I'm donating 50 billion dollars",
                    createdAt: "2021-09-15T12:48:00.000Z",
                },
            ],
        },
    ];

    const handlePress = (chatId: string) => {
        router.push(`/chats/${chatId}`);
    };

    return (
        <View className="flex-1">
            {chats &&
                chats.map((chat) => (
                    <TouchableOpacity
                        key={"Touchable Message Chat Number " + chat.id}
                        onPress={() => handlePress(chat.id)}
                        activeOpacity={0.7}
                    >
                        <View
                            key={"View Message Chat Number " + chat.id}
                            className="w-full"
                        >
                            <View
                                key={"View View Message Chat Number " + chat.id}
                                className="w-full flex-row p-4 align-middle"
                            >
                                <Image
                                    source={{ uri: chat.imageUri }}
                                    className="mr-4 h-12 w-12 rounded-full"
                                />
                                <View className="w-full">
                                    <View className="flex-row pr-16">
                                        <Text className="text-xl font-bold">
                                            {chat.name}
                                        </Text>
                                        <Text className="ml-auto text-sm font-light text-gray-400">
                                            {
                                                // Date and time of the last message
                                                new Date(
                                                    chat.messages[0].createdAt,
                                                ).toLocaleTimeString([], {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                            }
                                        </Text>
                                    </View>
                                    <Text>{chat.messages[0].content}</Text>
                                </View>
                            </View>
                            <View
                                className="my-1 h-1 w-full"
                                key={"Nessage Chat separator number " + chat.id}
                                lightColor="#eee"
                                darkColor="rgba(255,255,255,0.1)"
                            />
                        </View>
                    </TouchableOpacity>
                ))}
        </View>
    );
}
