// src/app/store/websocket.actions.ts - for connecting, disconnecting, sending messages and receiving messages

import { createAction, props } from '@ngrx/store';

import { WebsocketMessageModel } from 'src/shared/models/websocket-message.model';

export const socketConnect = createAction('[Websocket] Connect');
export const socketDisconnect = createAction('[Websocket] Disconnect');

export const socketSendMessage = createAction(
  '[Websocket] Send Message',
  props<{ message: WebsocketMessageModel }>()
);

export const socketConnectionSuccessful = createAction(
  '[Websocket] Connection Successful'
);

export const socketMessageReceived = createAction(
  '[Websocket] Message Received',
  props<{ message: WebsocketMessageModel }>()
);

export const socketConnectionClosed = createAction(
  '[Websocket] Connection Closed'
);

export const socketConnectionError = createAction(
  '[Websocket] Connection Error',
  props<{ error: any }>()
);
