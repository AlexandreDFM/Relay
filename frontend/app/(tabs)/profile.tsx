import { Image, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { UserAuth } from "@/types/IUserAuth";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useLocalSearchParams } from "expo-router";
import { useUserID } from "@/hook/useUser";

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
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require("@/assets/images/best-teacher.png")}
                    style={styles.image}
                />
                <Text style={styles.name}>{userProfile.name}</Text>
                <Text>{userProfile.status}</Text>
                <Text style={styles.email}>{userProfile.email}</Text>
                <View
                    style={styles.separator}
                    lightColor="#eee"
                    darkColor="rgba(255,255,255,0.1)"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    imageContainer: {
        alignItems: "center",
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 20, // Less rounded corners
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    email: {
        marginTop: 10,
        fontSize: 18,
        color: "gray",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});
