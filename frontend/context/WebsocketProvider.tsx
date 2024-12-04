import { useAuth } from "./AuthProvider";
import { createContext, useContext, useEffect, useState } from "react";

type WebSocketContextType = {
    ws: WebSocket | null;
    sendMessage: (message: string) => void;
    serverMessage: string;
    isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType>({
    ws: null,
    sendMessage: () => {},
    serverMessage: "",
    isConnected: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuth();
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [serverMessage, setServerMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (user) {
            const socket = new WebSocket("ws://127.0.0.1:8080");

            socket.onopen = () => {
                console.log("WebSocket connection opened");
                socket.send(`LOGIN ${user.email} ${user.password}`);
                setIsConnected(true);
            };

            socket.onmessage = (e) => {
                console.log("Message from server:", e.data);
                setServerMessage(e.data);
            };

            socket.onerror = (e) => {
                console.log("WebSocket error:", e);
                setIsConnected(false);
            };

            socket.onclose = (e) => {
                console.log("WebSocket connection closed:", e.code, e.reason);
                setIsConnected(false);
            };

            setWs(socket);

            return () => {
                socket.close();
            };
        }
    }, [user]);

    const sendMessage = (message: string) => {
        if (ws && isConnected) {
            ws.send(message);
        }
    };

    return (
        <WebSocketContext.Provider
            value={{ ws, sendMessage, serverMessage, isConnected }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};
