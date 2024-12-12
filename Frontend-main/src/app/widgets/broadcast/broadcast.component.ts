import { DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, effect, input, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { PrimeIcons } from 'primeng/api';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { WebsocketMessageModel } from 'src/shared/models/websocket-message.model';
import { selectSocketConnected, selectSocketMessageByType } from '../../store/websocket/websocket.selectors';

@Component({
  selector: 'app-broadcast',
  standalone: true,
  imports: [JsonPipe, DatePipe,],
  templateUrl: './broadcast.component.html',
})
@RegisterWidget('app-broadcast', PrimeIcons.MEGAPHONE)
export class BroadcastComponent {

  parameters$ = input.required<any>({ alias: 'parameters' });

  public connected$ = this.store.selectSignal(selectSocketConnected);

  // Storing All Messages: Components can store messages perpetually by updating local signals when a new message arrives.
  public broadcastMessage$ = this.store.selectSignal(selectSocketMessageByType("Broadcast"));
  public broadcastMessageSignals$: WritableSignal<Record<number, WritableSignal<WebsocketMessageModel>>> = signal<Record<number, WritableSignal<WebsocketMessageModel>>>({});
  public broadcastMessagesArray$ = computed(() => Object.values(this.broadcastMessageSignals$()));

  // ------------------------------------------------------------------------------------------------------------------------
  constructor(private store: Store) {

    // ------------------------------------------------------------------------------------------------------------------------
    effect(() => {
      const newMessage = this.broadcastMessage$(); // Get the latest "broadcast" message
      if (newMessage) {
        // Since we’re not replacing the entire array, the array reference (broadcastMessageSignals$) remains the same, and Angular only needs to append the new li elements without touching existing ones.
        const newMessageSignal = signal<WebsocketMessageModel>(newMessage);
        // Update the hash map by adding a new entry using the `timestamp` as the key
        this.broadcastMessageSignals$.update((currentSignals) => ({
          ...currentSignals, // Spread the current signals
          [newMessage.timestamp]: newMessageSignal, // Add the new message signal using `timestamp` as the key          
        }));
      }
    }, { allowSignalWrites: true });

  }

}
