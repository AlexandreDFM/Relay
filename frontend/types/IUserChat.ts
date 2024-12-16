import { MessageData } from "./IMessageData";

export interface UserChat {
    id: string;
    name: string;
    imageUri: string;
    isConnected: boolean;
    messages: MessageData[];
}
