import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

type WebSocketContextType = {
    ws: WebSocket | null;
    isConnected: boolean;
    sendMessage: (message: string) => Promise<string>;
};

const WebSocketContext = createContext<WebSocketContextType>({
    ws: null,
    isConnected: false,
    sendMessage: async () => {
        throw new Error("WebSocket is not connected.");
    },
});

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }: { children: JSX.Element }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [listeners, setListeners] = useState(new Map());

    useEffect(() => {
        const socket = new WebSocket("ws://127.0.0.1:8080");
        setWs(socket);

        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            console.log("Received message:", message);
            if (isConnected === false && event.data === "9999CONNECTED") {
                console.log("Connected to WebSocket server");
                setIsConnected(true);
            }

            listeners.forEach((listener) => listener(message));
        };

        socket.addEventListener("message", handleMessage);

        socket.addEventListener("open", () => {
            console.log("WebSocket connection established.");
        });

        socket.addEventListener("close", () => {
            console.log("WebSocket connection closed.");
        });

        socket.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
        });

        return () => {
            socket.removeEventListener("message", handleMessage);
            socket.close();
        };
    }, [listeners]);

    const sendMessage = useCallback(
        (message: string): Promise<string> => {
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                throw new Error("WebSocket is not connected.");
            }

            return new Promise((resolve) => {
                const handleResponse = (response: string) => {
                    resolve(response);
                };

                const listenerId = Symbol("listener");
                listeners.set(listenerId, handleResponse);

                ws.send(message);

                const cleanup = () => listeners.delete(listenerId);
                return cleanup;
            });
        },
        [ws, listeners],
    );

    return (
        <WebSocketContext.Provider value={{ ws, isConnected, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};
