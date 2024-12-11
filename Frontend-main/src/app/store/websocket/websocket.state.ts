import { WebsocketMessageModel } from "src/shared/models/websocket-message.model";

export interface WebsocketState {
    connected: boolean;
    // the reducer stores only the last message per type, components now have the flexibility to decide how to handle messages (store all or only last)
    lastMessages: Record<string, WebsocketMessageModel>;
}

export const initialWebsocketState: WebsocketState = {
    // the state contains only the connected status and a lastMessages object.
    connected: false,
    lastMessages: {},
};