import { useState, useCallback } from "react";
import { useWebSocket } from "@/context/WebsocketProvider";

type Message = string;
type ServerId = number;
type ChannelId = number;
type ClientId = number;
type ServerName = string;
type ChatName = string;
type Password = string;
type InviteUrl = string;
type VocalId = number;

type WebSocketResponse = string;

interface Client {
    id: ClientId;
    name: string;
    password: Password;
}

interface Server {
    id: ServerId;
    name: ServerName;
    channels: Channel[];
    voiceChats: VocalChat[];
}

interface Channel {
    id: ChannelId;
    name: string;
    messages: Message[];
}

interface VocalChat {
    id: VocalId;
    name: string;
}

interface UseServerManager {
    connectClient: (
        id: ClientId,
        name: string,
        password: Password,
    ) => Promise<WebSocketResponse>;
    disconnectClient: (id: ClientId) => void;
    addNewClient: (
        name: string,
        password: Password,
    ) => Promise<WebSocketResponse>;
    getClientList: () => Promise<string[]>;
    createServer: (server_name: ServerName) => Promise<WebSocketResponse>;
    createServerChat: (
        id_server: ServerId,
        chat_name: ChatName,
    ) => Promise<WebSocketResponse>;
    sendMessageOnServer: (
        id_server: ServerId,
        id_channel: ChannelId,
        message: Message,
    ) => Promise<WebSocketResponse>;
    modifyMessageOnServer: (
        id_server: ServerId,
        id_channel: ChannelId,
        id_message: number,
        message: Message,
    ) => Promise<WebSocketResponse>;
    deleteServer: (id_server: ServerId) => Promise<WebSocketResponse>;
    deleteServerChat: (
        id_server: ServerId,
        id_channel: ChannelId,
    ) => Promise<WebSocketResponse>;
    joinServer: (url_invite: InviteUrl) => Promise<WebSocketResponse>;
    joinServerChat: (
        id_server: ServerId,
        url_invite: InviteUrl,
    ) => Promise<WebSocketResponse>;
    getChannelMessages: (
        id_server: ServerId,
        id_channel: ChannelId,
        nb_messages: number,
    ) => Promise<Message[]>;
}

const useServerManager = (): UseServerManager => {
    const { sendMessage, isConnected } = useWebSocket();
    const [servers, setServers] = useState<Map<ServerId, Server>>(new Map());

    const handleRequest = useCallback(
        async (message: string): Promise<WebSocketResponse> => {
            if (!isConnected) {
                // throw new Error("WebSocket is not connected");
                console.error("WebSocket is not connected");
            }
            return await sendMessage(message);
        },
        [isConnected, sendMessage],
    );

    const connectClient = useCallback(
        async (
            id: ClientId,
            name: string,
            password: Password,
        ): Promise<WebSocketResponse> => {
            const response = await handleRequest(`0\r${name}\r${password}`);
            console.log(`Client ${name} connected: ${response}`);
            return response;
        },
        [handleRequest],
    );

    const disconnectClient = useCallback(
        (id: ClientId) => {
            console.log(`Client ${id} disconnected`);
            sendMessage(`1\r${id}`);
        },
        [sendMessage],
    );

    const addNewClient = useCallback(
        async (
            name: string,
            password: Password,
        ): Promise<WebSocketResponse> => {
            const response = await handleRequest(`2\r${name}\r${password}`);
            console.log(`New client added: ${name} - ${response}`);
            return response;
        },
        [handleRequest],
    );

    const getClientList = useCallback(async (): Promise<string[]> => {
        const response = await handleRequest("5");
        if (response.startsWith("200")) {
            const clients = response.split("/").slice(1);
            console.log("Clients fetched:", clients);
            return clients;
        } else {
            console.error("Error fetching clients:", response);
            return [];
        }
    }, [handleRequest]);

    const createServer = useCallback(
        async (server_name: ServerName): Promise<WebSocketResponse> => {
            const response = await handleRequest(`8\r${server_name}`);
            console.log(`New server created: ${server_name} - ${response}`);
            return response;
        },
        [handleRequest],
    );

    const createServerChat = useCallback(
        async (
            id_server: ServerId,
            chat_name: ChatName,
        ): Promise<WebSocketResponse> => {
            const response = await handleRequest(
                `9\r${id_server}\r${chat_name}`,
            );
            console.log(
                `New chat created in server ${id_server}: ${chat_name} - ${response}`,
            );
            return response;
        },
        [handleRequest],
    );

    const sendMessageOnServer = useCallback(
        async (
            id_server: ServerId,
            id_channel: ChannelId,
            message: Message,
        ): Promise<WebSocketResponse> => {
            const response = await handleRequest(
                `3\r${id_server}\r${id_channel}\r${message}`,
            );
            console.log(
                `Message sent to server ${id_server}, channel ${id_channel}: ${response}`,
            );
            return response;
        },
        [handleRequest],
    );

    const modifyMessageOnServer = useCallback(
        async (
            id_server: ServerId,
            id_channel: ChannelId,
            id_message: number,
            message: Message,
        ): Promise<WebSocketResponse> => {
            const response = await handleRequest(
                `6\r${id_server}\r${id_channel}\r${id_message}\r${message}`,
            );
            console.log(
                `Message modified in server ${id_server}, channel ${id_channel}: ${response}`,
            );
            return response;
        },
        [handleRequest],
    );

    const deleteServer = useCallback(
        async (id_server: ServerId): Promise<WebSocketResponse> => {
            const response = await handleRequest(`9\r${id_server}`);
            console.log(`Server ${id_server} deleted: ${response}`);
            return response;
        },
        [handleRequest],
    );

    const deleteServerChat = useCallback(
        async (
            id_server: ServerId,
            id_channel: ChannelId,
        ): Promise<WebSocketResponse> => {
            const response = await handleRequest(
                `9\r${id_server}\r${id_channel}`,
            );
            console.log(
                `Chat ${id_channel} deleted in server ${id_server}: ${response}`,
            );
            return response;
        },
        [handleRequest],
    );

    const joinServer = useCallback(
        async (url_invite: InviteUrl): Promise<WebSocketResponse> => {
            const response = await handleRequest(`9\r${url_invite}`);
            console.log(`Joined server via invite ${url_invite}: ${response}`);
            return response;
        },
        [handleRequest],
    );

    const joinServerChat = useCallback(
        async (
            id_server: ServerId,
            url_invite: InviteUrl,
        ): Promise<WebSocketResponse> => {
            const response = await handleRequest(
                `9\r${id_server}\r${url_invite}`,
            );
            console.log(
                `Joined chat in server ${id_server} via invite ${url_invite}: ${response}`,
            );
            return response;
        },
        [handleRequest],
    );

    const getChannelMessages = useCallback(
        async (
            id_server: ServerId,
            id_channel: ChannelId,
            nb_messages: number,
        ): Promise<Message[]> => {
            const response = await handleRequest(
                `7\r${id_server}\r${id_channel}\r${nb_messages}`,
            );
            const responseArray = response.split("-");
            responseArray[0] = responseArray[0].slice(4); // remove the status code from the first element

            const messagesArray = [];

            for (let i = 0; i < responseArray.length; i += 3) {
                messagesArray.push(responseArray.slice(i, i + 3));
            }

            // Reverse the array to have the most recent messages first
            messagesArray.reverse();

            const messages = messagesArray.map((message) => message.join(" "));

            console.log(
                `Fetched messages from server ${id_server}, channel ${id_channel}:`,
                messages,
            );
            return messages;
        },
        [handleRequest],
    );

    return {
        connectClient,
        disconnectClient,
        addNewClient,
        getClientList,
        createServer,
        createServerChat,
        sendMessageOnServer,
        modifyMessageOnServer,
        deleteServer,
        deleteServerChat,
        joinServer,
        joinServerChat,
        getChannelMessages,
    };
};

export default useServerManager;
