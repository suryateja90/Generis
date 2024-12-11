import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { AppState, initialAppState } from 'src/app/store/app.state';
import { BlotterComponent } from './blotter.component';

describe('BlotterComponent', () => {
  let component: BlotterComponent;
  let fixture: ComponentFixture<BlotterComponent>;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlotterComponent],
      providers: [provideMockStore({ initialState })]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BlotterComponent);
    component = fixture.componentInstance;

    // Directly set the parameters$ input signal with mock data
    const parameters = {};
    (component as any).parameters$ = signal(parameters);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
