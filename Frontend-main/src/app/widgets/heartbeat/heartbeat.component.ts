import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSocketConnected, selectSocketMessageByType } from '../../store/websocket/websocket.selectors';
import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { WebsocketMessageType } from 'src/shared/models/websocket-message.model';

@Component({
  selector: 'app-heartbeat',
  standalone: true,
  imports: [DatePipe,],
  templateUrl: './heartbeat.component.html',
})
@RegisterWidget('app-heartbeat')
export class HeartbeatComponent {
  
  parameters$ = input.required<any>({ alias: 'parameters' });

  public connected$ = this.store.selectSignal(selectSocketConnected);

  // Storing Last Message Only: For message types where only the latest message is relevant (e.g., 'heartbeat'), components can simply use the last message from the store without additional local storage.

  public heartbeatMessage$ = this.store.selectSignal(selectSocketMessageByType("Heartbeat"));

  // ------------------------------------------------------------------------------------------------------------------------
  constructor(private store: Store) {

  }

}
