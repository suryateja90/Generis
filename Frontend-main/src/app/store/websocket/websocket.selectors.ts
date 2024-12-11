//  src/app/store/websocket.selectors.ts - selectors to match the updated state shape.
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { WebsocketMessageType } from 'src/shared/models/websocket-message.model';
import { WebsocketState } from './websocket.state';

export const selectWebsocketState = createFeatureSelector<WebsocketState>('websocket');

export const selectSocketConnected = createSelector(
  selectWebsocketState,
  (state) => state.connected
);

export const selectSocketLastMessages = createSelector(
  selectWebsocketState,
  (state) => state.lastMessages
);

export const selectSocketMessageByType = (type: WebsocketMessageType) =>
  createSelector(selectSocketLastMessages, (lastMessages) => lastMessages[type]);
