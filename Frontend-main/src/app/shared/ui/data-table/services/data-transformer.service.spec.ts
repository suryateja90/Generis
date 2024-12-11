import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppState, initialAppState } from 'src/app/store/app.state';
import { DataTransformerService } from './data-transformer.service';

describe('DataTransformerService', () => {
  let service: DataTransformerService;
  let store: MockStore;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        DataTransformerService,
      ]
    });
    service = TestBed.inject(DataTransformerService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
