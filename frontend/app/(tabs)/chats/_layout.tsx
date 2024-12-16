import { StyleSheet } from "nativewind";
import { Link, Stack } from "expo-router";
import { Text } from "@/components/Themed";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable } from "react-native";
import { useAuth } from "@/context/AuthProvider";
import useServerManager from "@/hook/useServerManager";
import { useWebSocket } from "@/context/WebsocketProvider";

export default function ChatsLayout() {
    const { isLogged } = useAuth();
    const { isConnected } = useWebSocket();
    const { getClientList } = useServerManager();
    const [clientlist, setClientList] = useState<string[]>([]);

    const styles = StyleSheet.create({
        image: {
            borderRadius: 100,
            marginLeft: 18,
            width: 50,
            height: 50,
        },
    });

    useEffect(() => {
        const fetchClientList = async () => {
            if (!isLogged || !isConnected) return;
            const clientlist = await getClientList();
            setClientList(clientlist);
        };

        fetchClientList();
    }, [isLogged, isConnected]);

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#f4511e",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Home",
                    navigationBarHidden: true,
                    headerBackButtonMenuEnabled: false,
                    header: () => (
                        <div className="w-full flex-row border-b-4 border-slate-500 bg-transparent p-4">
                            <div className="flex flex-row justify-center gap-4">
                                <Text className="text-xl font-bold">Chats</Text>
                            </div>
                        </div>
                    ),
                }}
            />
            <Stack.Screen
                name="[chatId]"
                options={({
                    route,
                }: {
                    route: { params?: { chatId?: string } };
                }) => {
                    const chatId = route.params?.chatId || "0";
                    const clientName =
                        clientlist[parseInt(chatId)] || "Unknown Client";
                    return {
                        header: ({}) => (
                            <div className="flex w-full flex-row items-center border-b-2 border-slate-500 bg-slate-200 p-4">
                                <Link href="/chats" asChild>
                                    <Pressable>
                                        {({ pressed }) => (
                                            <Ionicons
                                                name="arrow-back"
                                                size={24}
                                                style={{
                                                    marginRight: 15,
                                                    opacity: pressed ? 0.5 : 1,
                                                }}
                                            />
                                        )}
                                    </Pressable>
                                </Link>
                                <div className="flex w-full flex-row items-center justify-center gap-4">
                                    <Image
                                        source={require("@/assets/images/placeholders/profile_placeholder.png")}
                                        style={styles.image}
                                    />
                                    <Text className="text-xl font-bold">
                                        {clientName}
                                    </Text>
                                </div>
                                <Link href="/chats" asChild>
                                    <Pressable>
                                        {({ pressed }) => (
                                            <Ionicons
                                                name="call"
                                                size={24}
                                                style={{
                                                    marginRight: 15,
                                                    opacity: pressed ? 0.5 : 1,
                                                }}
                                            />
                                        )}
                                    </Pressable>
                                </Link>
                                <Link href="/chats" asChild>
                                    <Pressable>
                                        {({ pressed }) => (
                                            <Ionicons
                                                name="camera"
                                                size={24}
                                                style={{
                                                    marginRight: 15,
                                                    opacity: pressed ? 0.5 : 1,
                                                }}
                                            />
                                        )}
                                    </Pressable>
                                </Link>
                            </div>
                        ),
                        headerBackButtonMenuEnabled: true,
                        presentation: "modal",
                    };
                }}
            />
        </Stack>
    );
}
