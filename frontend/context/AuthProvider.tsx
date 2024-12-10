import { useSegments, router } from "expo-router";
import { useWebSocket } from "./WebsocketProvider";
import useServerManager from "@/hook/useServerManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
    email: string;
    password: string;
    accessToken: any;
};

type AuthType = {
    user: User | null;
    isLogged: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;
};

const AuthContext = createContext<AuthType>({
    user: {
        email: "",
        password: "",
        accessToken: "",
    },
    isLogged: false,
    setUser: () => {},
    clearUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

function useProtectedRoute(user: any) {
    const segments = useSegments();

    useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";
        if (!user && !inAuthGroup) {
            router.push("/login");
        } else if (user && inAuthGroup) {
            router.push("/");
        }
    }, [user, segments]);
}

export function AuthProvider({
    children,
}: {
    children: JSX.Element;
}): JSX.Element {
    const { isConnected } = useWebSocket();
    const { connectClient } = useServerManager();
    const [user, setUser] = useState<User | null>(null);
    const [isLogged, setIsLogged] = useState<boolean>(false);

    useEffect(() => {
        const loadUser = async () => {
            const userString = await AsyncStorage.getItem("user");
            if (userString) {
                setUser(JSON.parse(userString));
            }
        };

        loadUser();
    }, []);

    useProtectedRoute(user);

    useEffect(() => {
        const storeUser = async () => {
            if (user) {
                await AsyncStorage.setItem("user", JSON.stringify(user));
            } else {
                await AsyncStorage.removeItem("user");
            }
        };

        storeUser();
    }, [user]);

    useEffect(() => {
        const handleLoginWithCredentials = async () => {
            if (isLogged) return;
            if (!(isConnected && user)) return;
            const response = await connectClient(0, user.email, user.password);
            if (response === "200 You are connected\n") {
                console.log("Client connected and approved!");
                setUser({
                    ...user,
                    accessToken: response,
                });
                setIsLogged(true);
            } else {
                console.error("Connection failed:", response);
                setUser(null);
                setIsLogged(false);
            }
        };

        handleLoginWithCredentials();
    }, [isConnected, user]);

    const authContext: AuthType = {
        user,
        setUser,
        isLogged,
        clearUser: () => setUser(null),
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
}
