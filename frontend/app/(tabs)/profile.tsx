import { Image, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

interface User {
    id: string;
    name: string;
    email: string;
    imageUri: string;
    password: string;
}

export default function ProfileScreen() {
    const user: User = {
        id: "1",
        name: "HyunChul Joe", //si possible relier ça au back et garder les mêmes infos entre le profil et les settings
        email: "joh@kmu.ac.kr", //same here
        imageUri:
            "https://lh3.googleusercontent.com/55OB_phWrUDH6ThZuNxCfwLham4Zwzr1UelbkjKmdB4NCtLc9Itzm7fayKiqAfqolhzARpB83VrLQNWAT-CGCyyPLy7APpeXYI9dCK4XfJA=w1280",
        password: "MyPasswordIsReallyStrong",
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require("@/assets/images/best-teacher.png")}
                    style={styles.image}
                />
                <Text style={styles.name}>{user.name}</Text>
                <Text>Funniest professor of Keimyung</Text>
                <Text style={styles.email}>{user.email}</Text>
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
