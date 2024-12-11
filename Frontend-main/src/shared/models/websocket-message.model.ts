// src/shared/models/websocket-message.model.ts

export type WebsocketMessageType = "Admin" | "Heartbeat" | "Echo" | "Broadcast" | "Trade" | "Quote" | "Book" | "Request" | "Reply" | "Oppurtunity";

export interface WebsocketMessageModel {
  type: WebsocketMessageType,
  timestamp: number; // Date strings are parsed as strings in JSON
  payload?: any[];
};