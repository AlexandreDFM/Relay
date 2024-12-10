import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useWebSocket } from "@/context/WebsocketProvider";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { isConnected } = useWebSocket();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="home" color={color} />
                    ),
                    headerRight: () => (
                        <div className="flex flex-row">
                            <Link href="/notifications-modal" asChild>
                                <Pressable>
                                    {({ pressed }) => (
                                        <FontAwesome
                                            name="bell"
                                            size={25}
                                            color={
                                                Colors[colorScheme ?? "light"]
                                                    .text
                                            }
                                            style={{
                                                marginRight: 15,
                                                opacity: pressed ? 0.5 : 1,
                                            }}
                                        />
                                    )}
                                </Pressable>
                            </Link>
                            <Link href="/help-modal" asChild>
                                <Pressable>
                                    {({ pressed }) => (
                                        <FontAwesome
                                            name="question"
                                            size={25}
                                            color={
                                                Colors[colorScheme ?? "light"]
                                                    .text
                                            }
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
                }}
            />
            <Tabs.Screen
                name="chats"
                options={{
                    title: "Chat",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="comment" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <>
                            <TabBarIcon name="user" color={color} />
                            <div
                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                            />
                        </>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="cogs" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
