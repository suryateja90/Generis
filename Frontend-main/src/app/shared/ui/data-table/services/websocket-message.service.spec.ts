import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppState, initialAppState } from 'src/app/store/app.state';
import { WebsocketMessageService } from './websocket-message.service';

describe('WebsocketMessageService', () => {
  let service: WebsocketMessageService;
  let store: MockStore;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        WebsocketMessageService,
      ]
    });
    service = TestBed.inject(WebsocketMessageService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
