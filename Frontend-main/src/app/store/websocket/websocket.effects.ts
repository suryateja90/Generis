// src/app/store/websocket/websocket.effects.ts 

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';

import * as WebsocketActions from './websocket.actions';

import { WebsocketService } from './websocket.service';

@Injectable()
export class WebsocketEffects {

  // ------------------------------------------------------------------------------------------------------------------
  constructor(
    private actions$: Actions,
    private websocketService: WebsocketService,
  ) { }


  // ------------------------------------------------------------------------------------------------------------------
  connect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.socketConnect),
        tap(() => this.websocketService.connect())
      ),
    { dispatch: false }
  );


  // ------------------------------------------------------------------------------------------------------------------
  disconnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.socketDisconnect),
        tap(() => this.websocketService.disconnect())
      ),
    { dispatch: false }
  );


  // ------------------------------------------------------------------------------------------------------------------
  sendMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.socketSendMessage),
        tap(({ message }) => this.websocketService.sendMessage(message))
      ),
    { dispatch: false }
  );

}
