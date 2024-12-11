// src/app/websocket/websocket.service.ts
import { effect, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of, timer } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { ConfigService } from 'src/app/services/config.service';
import { WebsocketMessageModel } from '../../../shared/models/websocket-message.model';
import { socketConnect, socketConnectionClosed, socketConnectionError, socketConnectionSuccessful, socketDisconnect, socketMessageReceived } from './websocket.actions';
import { selectSocketMessageByType } from './websocket.selectors';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {

  private socket$: WebSocketSubject<WebsocketMessageModel> | null = null;
  public heartbeatMessage$ = this.store.selectSignal(selectSocketMessageByType("Heartbeat"));
  private heartbeatTimeoutId: any;


  // ------------------------------------------------------------------------------------------------------------------
  constructor(
    private store: Store,
    private configService: ConfigService,
  ) {
    // Monitor heartbeat messages using an Angular Signal effect
    effect(() => {
      // This effect runs whenever heartbeatMessage$ updates (i.e., a heartbeat is received)
      const heartbeatMessage = this.heartbeatMessage$();

      // Reset the heartbeat timer whenever a heartbeat message is received
      this.resetHeartbeatTimer();
    })
  }

  // ------------------------------------------------------------------------------------------------------------------
  resetHeartbeatTimer() {
    // Clear any existing timer
    this.heartbeatTimeoutId && clearTimeout(this.heartbeatTimeoutId);

    // No heartbeat message received in the last 5 seconds? Trigger reconnection
    this.heartbeatTimeoutId = setTimeout(() => this.reconnect(), 5000);
  }

  // ------------------------------------------------------------------------------------------------------------------
  private get socketServerUrl(): string {
    return this.configService.getSocketServerUrl(); // Use dynamic API URL from ConfigService
  }

  // ------------------------------------------------------------------------------------------------------------------
  connect(): void {

    const accessToken = localStorage.getItem('accessToken');
    const url = `${this.socketServerUrl}/?token=${accessToken}`;

    if (!this.socket$ || this.socket$.closed) {

      this.socket$ = webSocket<WebsocketMessageModel>({
        url,
        deserializer: ({ data }) => JSON.parse(data),
        openObserver: { next: () => this.store.dispatch(socketConnectionSuccessful()) },
        closeObserver: { next: () => this.store.dispatch(socketConnectionClosed()) },
      });

      this.socket$
        .pipe(
          tap({ error: (err) => { this.store.dispatch(socketConnectionError({ error: err })) } }),
          catchError(() => {
            this.configService.incrementServerIndex();
            timer(1618).subscribe(() => this.reconnect());
            return of();
          }),
        )
        .subscribe((message) => this.onMessageReceived(message));

    }

  }

  // ------------------------------------------------------------------------------------------------------------------
  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    clearTimeout(this.heartbeatTimeoutId);
  }

  // ------------------------------------------------------------------------------------------------------------------
  // handle disconnection, cleanup and reconnection.
  reconnect(): void {
    this.store.dispatch(socketDisconnect());
    this.store.dispatch(socketConnect());
  }

  // ------------------------------------------------------------------------------------------------------------------
  sendMessage(message: WebsocketMessageModel): void {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }

  // ------------------------------------------------------------------------------------------------------------------
  onMessageReceived(message: WebsocketMessageModel) {
    this.store.dispatch(socketMessageReceived({ message }));
  }
}
