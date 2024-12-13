import { DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, effect, input, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { PrimeIcons } from 'primeng/api';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { WebsocketMessageModel } from 'src/shared/models/websocket-message.model';
import { socketSendMessage } from '../../store/websocket/websocket.actions';
import { selectSocketConnected, selectSocketMessageByType } from '../../store/websocket/websocket.selectors';

@Component({
  selector: 'app-echo',
  standalone: true,
  imports: [JsonPipe, DatePipe,],
  templateUrl: './echo.component.html',
})
@RegisterWidget('app-echo', PrimeIcons.COMMENT)
export class EchoComponent {

  parameters$ = input.required<any>({ alias: 'parameters' });

  echoTitle$ = computed(() => this.parameters$()?.echoTitle || 'N/A');
  echoArray$ = computed(() => this.parameters$()?.echoArray || []);

  public connected$ = this.store.selectSignal(selectSocketConnected);

  // Storing All Messages: Components can store messages perpetually by updating local signals when a new message arrives.
  public echoMessage$ = this.store.selectSignal(selectSocketMessageByType("Echo"));
  public echoMessageSignals$: WritableSignal<Record<number, WritableSignal<WebsocketMessageModel>>> = signal<Record<number, WritableSignal<WebsocketMessageModel>>>({});
  public echoMessagesArray$ = computed(() => Object.values(this.echoMessageSignals$()));

  // ------------------------------------------------------------------------------------------------------------------------
  constructor(private store: Store) {

    effect(() => {
      const newMessage = this.echoMessage$(); // Get the latest "broadcast" message
      if (newMessage) {
        // Since we’re not replacing the entire array, the array reference (echoMessageSignals$) remains the same, and Angular only needs to append the new li elements without touching existing ones.
        const newMessageSignal = signal<WebsocketMessageModel>(newMessage);
        // Update the hash map by adding a new entry using the `timestamp` as the key
        this.echoMessageSignals$.update((currentSignals) => ({
          ...currentSignals, // Spread the current signals
          [newMessage.timestamp]: newMessageSignal, // Add the new message signal using `timestamp` as the key
        }));
      }
    }, { allowSignalWrites: true });

  }

  // ------------------------------------------------------------------------------------------------------------------------
  echo(): void {
    const message: WebsocketMessageModel = {
      type: 'Echo',
      timestamp: Date.now(),
      payload: ['Hello, this is a test message!'],
    };
    this.store.dispatch(socketSendMessage({ message }));
  }


}
