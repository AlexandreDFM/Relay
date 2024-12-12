import { Image } from "react-native";
import { User } from "@/types/IUser";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Text, View } from "@/components/Themed";

export default function ProfileScreen() {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<User>({
        id: -1,
        name: "",
        imageUri: "",
        status: "",
        email: "",
        password: "",
        createdAt: "",
        updatedAt: "",
    });

    useEffect(() => {
        if (user) setUserProfile(user);
    }, [user]);

    return (
        <View className="flex-1 items-center justify-center">
            <View className="items-center">
                <Image
                    source={require("@/assets/images/best-teacher.png")}
                    className="h-52 w-52 rounded-3xl"
                />
                <Text className="mt-3 text-2xl font-bold">
                    {userProfile.name}
                </Text>
                <Text>{userProfile.status}</Text>
                <Text className="mt-3 text-lg color-gray-500">
                    {userProfile.email}
                </Text>
                <View
                    className="my-8 h-1 w-4/5"
                    lightColor="#eee"
                    darkColor="rgba(255,255,255,0.1)"
                />
            </View>
        </View>
    );
}
