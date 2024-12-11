import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppState, initialAppState } from 'src/app/store/app.state';
import { HeartbeatComponent } from './heartbeat.component';

describe('HeartbeatComponent', () => {
  let component: HeartbeatComponent;
  let fixture: ComponentFixture<HeartbeatComponent>;
  let store: MockStore;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartbeatComponent, // Import the standalone component
        StoreModule.forRoot({}), // Ensure the Store module is included
      ],
      providers: [
        provideMockStore({ initialState }), // Provide mock store
      ],
    })
      .compileComponents();

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(HeartbeatComponent);
    component = fixture.componentInstance;

    // Directly set the parameters$ input signal with mock data
    const parameters = { Title: 'Heartbeat' };
    (component as any).parameters$ = signal(parameters);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
    expect(component).toBeTruthy();
  });
});

