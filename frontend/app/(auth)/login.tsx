import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "../../components/Themed";
import { useAuth } from "../../context/AuthProvider";

import {
    BackHandler,
    Button,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { UserAuth } from "@/types/IUserAuth";

export default function LoginScreen() {
    const { setUser } = useAuth();
    const colorScheme = useColorScheme();
    const [password, setPassword] = useState("password");
    const [email, setEmail] = useState("contact@relay.com");

    const user: UserAuth = {
        id: "0",
        name: "HyunChul Joe",
        imageUri:
            "https://lh3.googleusercontent.com/55OB_phWrUDH6ThZuNxCfwLham4Zwzr1UelbkjKmdB4NCtLc9Itzm7fayKiqAfqolhzARpB83VrLQNWAT-CGCyyPLy7APpeXYI9dCK4XfJA=w1280",
        status: "Funniest professor of Keimyung",
        email: "joh@kmu.ac.kr",
        password: "MyPasswordIsReallyStrong",
        createdAt: "2021-09-15T12:48:00.000Z",
        updatedAt: "2021-09-15T12:48:00.000Z",
    };

    const login = async () => {
        setUser({
            email: email,
            password: password,
            accessToken: "123456",
        });
        return;
        // await fetch(process.env.EXPO_PUBLIC_API_URL + "/login", {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //         "X-Group-Authorization":
        //             process.env.EXPO_PUBLIC_API_GROUP_AUTHORIZATION || "",
        //     },
        //     body: JSON.stringify({
        //         email,
        //         password,
        //     }),
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if (data.access_token) {
        //             setUser({
        //                 email: email,
        //                 password: password,
        //                 accessToken: data.access_token,
        //             });
        //             return;
        //         }
        //     })
        //     .catch((error) => {
        //         console.log("error login");
        //     });
    };

    useEffect(() => {
        const backAction = () => {
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    return (
        <View style={styles.container}>
            {/* <MasuraoTitle /> */}
            <View style={styles.separator} />
            <TextInput
                style={{
                    ...styles.text_input,
                }}
                placeholder="Email."
                onChangeText={(email) => setEmail(email)}
                defaultValue={email}
            />
            <View style={styles.separator} />
            <TextInput
                style={{
                    ...styles.text_input,
                }}
                placeholder="Password."
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                defaultValue={password}
            />
            <View style={styles.separator} />
            <Button onPress={login} title="Login" />
            <View style={styles.separator} />
            <Text
                style={{
                    ...styles.no_account,
                }}
            >
                Don't have an account ?
                <TouchableOpacity
                    className="ml-2"
                    onPress={() => {
                        // router.push(`/register/`);
                    }}
                >
                    Sign up
                </TouchableOpacity>
            </Text>
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    separator: {
        margin: 33 / 2,
        height: 1,
        width: "80%",
    },
    title: {
        fontFamily: "Roboto",
        fontSize: 20,
        fontWeight: "bold",
        margin: 30,
    },
    text_input: {
        width: 210,
    },
    no_account: {
        marginTop: 20,
        height: 30,
    },
    login_btn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 30,
        backgroundColor: "white",
    },
});
