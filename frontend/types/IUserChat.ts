import { Message } from "./IMessage";

export interface UserChat {
    id: string;
    name: string;
    imageUri: string;
    isConnected: boolean;
    messages: Message[];
}
