import { useSegments, router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
    email: string;
    password: string;
    accessToken: any;
};

type AuthType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthType>({
    user: {
        email: "",
        password: "",
        accessToken: "",
    },
    setUser: () => {},
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
    const [user, setUser] = useState<User | null>(null);

    useProtectedRoute(user);

    const authContext: AuthType = {
        user,
        setUser,
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
}
