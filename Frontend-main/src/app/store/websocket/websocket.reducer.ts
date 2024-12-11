// src/app/store/websocket.reducer.ts - use NgRX to handle actions and manage the state accordingly
import { createReducer, on } from '@ngrx/store';

import * as WebsocketActions from './websocket.actions';

import { initialWebsocketState } from './websocket.state';

export const websocketReducer = createReducer(
  initialWebsocketState,

  on(WebsocketActions.socketConnect, (state) => ({ ...state, connected: false, })),
  on(WebsocketActions.socketConnectionSuccessful, (state) => ({ ...state, connected: true, })),
  on(WebsocketActions.socketDisconnect, (state) => ({ ...state, connected: false, lastMessages: {}, })),
  on(WebsocketActions.socketConnectionClosed, (state) => ({ ...state, connected: false, })),
  on(WebsocketActions.socketConnectionError, (state) => ({ ...state, connected: false, })),

  on(WebsocketActions.socketMessageReceived, (state, { message }) => ({ ...state, lastMessages: { ...state.lastMessages, [message.type]: message, }, })),
);
