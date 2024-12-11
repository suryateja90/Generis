import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, initialAppState } from 'src/app/store/app.state';
import { BroadcastComponent } from './broadcast.component';

describe('BroadcastComponent', () => {
  let component: BroadcastComponent;
  let fixture: ComponentFixture<BroadcastComponent>;
  let store: MockStore;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BroadcastComponent, // Import the standalone component
        StoreModule.forRoot({}), // Ensure the Store module is included
      ],
      providers: [provideMockStore({ initialState })]
    })
      .compileComponents();
    store = TestBed.inject(MockStore) as MockStore;

    fixture = TestBed.createComponent(BroadcastComponent);
    component = fixture.componentInstance;

    // Directly set the parameters$ input signal with mock data
    const parameters = { Title: 'Broadcast' };
    (component as any).parameters$ = signal(parameters);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
