import {
    Text,
    Button,
    Platform,
    TextInput,
    BackHandler,
    useColorScheme,
    TouchableOpacity,
    Image,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "../../components/Themed";
import { useAuth } from "../../context/AuthProvider";
import useServerManager from "@/hook/useServerManager";
import relayLogoFull from "@/assets/images/logos/relay-logo-full.png";

export default function LoginScreen() {
    const { setUser } = useAuth();
    const colorScheme = useColorScheme();
    const [email, setEmail] = useState("Bob");
    const [password, setPassword] = useState("pass");
    const { connectClient } = useServerManager();

    const login = async () => {
        const response = await connectClient(0, email, password);
        if (response === "200 You are connected\n") {
            console.log("Client connected and approved!");
            setUser({
                id: 0,
                name: email,
                imageUri:
                    "@/assets/images/placeholders/profile_placeholder.png",
                status: "Hey there!",
                email: email,
                password: password,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            router.push(`/`);
        } else {
            console.error("Connection failed:", response);
            alert("Login failed. Please try again.");
        }
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

    const styleView = "m-4 h-1 w-4/5";

    return (
        <View className="h-full justify-center p-24 text-center align-middle">
            <View
                className={`flex flex-col justify-center text-center align-middle sm:p-36`}
            >
                <Image source={relayLogoFull} className="mx-auto h-48 w-48" />
                <TextInput
                    className="w-full border-2 border-slate-400 bg-gray-100 text-center"
                    placeholder="Email."
                    onChangeText={(email) => setEmail(email)}
                    defaultValue={email}
                />
                <View className={`${styleView}`} />
                <TextInput
                    className="w-full border-2 border-slate-400 bg-gray-100 text-center"
                    placeholder="Password."
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    defaultValue={password}
                />
                <View className={`${styleView}`} />
            </View>
            <div className="flex flex-col justify-center text-center align-middle sm:px-36">
                <Button onPress={login} title="Login" />
            </div>
            <View className={`${styleView}`} />
            <Text className="mt-5 h-8 text-center">
                Don't have an account ?
                <TouchableOpacity
                    className="ml-2"
                    onPress={() => {
                        // router.push(`/register/`);
                    }}
                >
                    <Text>Sign up</Text>
                </TouchableOpacity>
            </Text>
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
}
