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

export default function RegisterScreen() {
    const { setUser } = useAuth();
    const colorScheme = useColorScheme();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const register = async () => {
        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return;
        }

        await fetch(process.env.EXPO_PUBLIC_API_URL + "/register", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-Group-Authorization":
                    process.env.EXPO_PUBLIC_API_GROUP_AUTHORIZATION || "",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.access_token) {
                    setUser({
                        email: email,
                        password: password,
                        accessToken: data.access_token,
                    });
                    router.push("/login");
                    return;
                }
            })
            .catch((error) => {
                console.log("error register");
            });
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
        <View className="flex-1 justify-center align-middle">
            <View className="m-16 h-1 w-4/5" />
            <TextInput
                className="w-56"
                placeholder="Email"
                onChangeText={(email) => setEmail(email)}
                defaultValue={email}
            />
            <View className="m-16 h-1 w-4/5" />
            <TextInput
                className="w-56"
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                defaultValue={password}
            />
            <View className="m-16 h-1 w-4/5" />
            <TextInput
                className="w-56"
                placeholder="Confirm Password"
                secureTextEntry={true}
                onChangeText={(confirmPassword) =>
                    setConfirmPassword(confirmPassword)
                }
                defaultValue={confirmPassword}
            />
            <View className="m-16 h-1 w-4/5" />
            <Button onPress={register} title="Register" />
            <View className="m-16 h-1 w-4/5" />
            <Text className="mt-5 h-8">
                Already have an account?
                <TouchableOpacity
                    onPress={() => {
                        router.push("/login");
                    }}
                >
                    Login
                </TouchableOpacity>
            </Text>
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
}
