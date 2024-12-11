import { TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, initialAppState } from 'src/app/store/app.state';
import { ReportingDataService } from './reporting-data.service';

describe('ReportingDataService', () => {
  let service: ReportingDataService;
  let store: MockStore;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        ReportingDataService,
      ]
    });
    service = TestBed.inject(ReportingDataService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
