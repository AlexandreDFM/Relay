import { Image } from "react-native";
import { useEffect, useState } from "react";
import { UserAuth } from "@/types/IUserAuth";
import { useAuth } from "@/context/AuthProvider";
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";

export default function ProfileScreen() {
    const [userProfile, setUserProfile] = useState<UserAuth>({
        id: "",
        name: "",
        imageUri: "",
        status: "",
        email: "",
        password: "",
        createdAt: "",
        updatedAt: "",
    });

    const { user } = useAuth();
    const params = useLocalSearchParams();
    const userId = Array.isArray(params.userId)
        ? params.userId[0]
        : params.userId;

    useEffect(() => {
        // useUserID(user?.accessToken, Number(userId)).then((data) =>
        //     setUserProfile(data),
        // );
        setUserProfile({
            id: "0",
            name: "HyunChul Joe",
            imageUri:
                "https://lh3.googleusercontent.com/55OB_phWrUDH6ThZuNxCfwLham4Zwzr1UelbkjKmdB4NCtLc9Itzm7fayKiqAfqolhzARpB83VrLQNWAT-CGCyyPLy7APpeXYI9dCK4XfJA=w1280",
            status: "Funniest professor of Keimyung",
            email: "joh@kmu.ac.kr",
            password: "MyPasswordIsReallyStrong",
            createdAt: "2021-09-15T12:48:00.000Z",
            updatedAt: "2021-09-15T12:48:00.000Z",
        });
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
