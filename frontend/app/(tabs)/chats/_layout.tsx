import { Stack } from "expo-router";

export default function ChatsLayout() {
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
            {/* Optionally configure static options outside the route.*/}
            <Stack.Screen
                name="index"
                options={{ title: "Home", navigationBarHidden: true }}
            />
            <Stack.Screen
                name="[chatId]"
                options={({ route }) => ({
                    title: `Chat ${(route.params as { chatId: string }).chatId}`,
                    headerBackButtonMenuEnabled: true,
                })}
            />
        </Stack>
    );
}
