import { computed, effect, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectSocketLastMessages } from 'src/app/store/websocket/websocket.selectors';
import { WebsocketMessageModel, WebsocketMessageType } from 'src/shared/models/websocket-message.model';
import { AbstractParametersService, AbstractParametersServiceConfigOptions } from './abstract-parameters.service';

export interface WebsocketMessageServiceProcessMethods {
  data?: (items: unknown[]) => void;
}

export interface WebsocketMessageServiceConfigOptions extends WebsocketMessageServiceProcessMethods, AbstractParametersServiceConfigOptions {
}

@Injectable()
export class WebsocketMessageService extends AbstractParametersService {
  private dataKey$ = computed<string>(() => this.parameters$ ? this.parameters$()?.dataKey : undefined);

  private processMethods: WebsocketMessageServiceProcessMethods = {
    data: (items: unknown[]) => { },
  };

  private lastMessages$ = this.store.selectSignal(selectSocketLastMessages);
  private websocketMessageType$ = computed<WebsocketMessageType>(() => this.parameters$ ? this.parameters$()?.websocketMessageType : undefined);
  private websocketMessage$ = computed<WebsocketMessageModel>(() => this.lastMessages$()?.[this.websocketMessageType$()]);

  // --------------------------------------------------------------------------
  constructor(private store: Store) {
    super();

    effect(() => {
      if (this.dataKey$()) {
        const items = this.websocketMessage$()?.payload;
        if (items) {
          this.processMethods.data(items);
        }
      }
    }, { allowSignalWrites: true });
  }

  // --------------------------------------------------------------------------
  public override config(options: WebsocketMessageServiceConfigOptions) {
    super.config(options);

    // Iterate over the process methods and update them if corresponding options are provided
    Object.keys(this.processMethods).forEach(method => {
      if (options[method]) {
        this.processMethods[method] = options[method];
      }
    });
  }
}
