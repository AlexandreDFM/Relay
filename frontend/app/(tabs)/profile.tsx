import { Image, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

interface User {
    id: string;
    name: string;
    imageUri: string;
}

export default function ProfileScreen() {
    const user: User = {
        id: "1",
        name: "Elon Musk",
        imageUri:
            "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png",
    };

    return (
        <View className="flex-1 items-center justify-center">
            <View>
                <Image
                    source={{ uri: user.imageUri }}
                    className="mr-4 h-full w-full rounded-full"
                />
                <Text className="text-xl font-bold">{user.name}</Text>
                <Text>CEO of SpaceX</Text>
                <View
                    className="my-4 h-1 w-4/5"
                    lightColor="#eee"
                    darkColor="rgba(255,255,255,0.1)"
                />
            </View>
        </View>
    );
}
