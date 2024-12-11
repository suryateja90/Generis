// src/app/widgets/opportunities/opportunities.spec.ts
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppState, initialAppState } from 'src/app/store/app.state';
import { OpportunitiesComponent } from './opportunities.component';

describe('OpportunitiesComponent', () => {
  let component: OpportunitiesComponent;
  let fixture: ComponentFixture<OpportunitiesComponent>;
  let store: MockStore;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunitiesComponent],
      providers: [provideMockStore({ initialState })]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OpportunitiesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Directly set the parameters$ input signal with mock data
    const parameters = { Title: 'Opportunities' };
    (component as any).parameters$ = signal(parameters);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
