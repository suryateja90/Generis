import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { signal } from '@angular/core';
import { AppState, initialAppState } from 'src/app/store/app.state';
import { DataTransformerService } from '../services/data-transformer.service';
import { DtColumnSelectorComponent } from './dt-column-selector.component';

describe('DtColumnSelectorComponent', () => {
  let component: DtColumnSelectorComponent;
  let fixture: ComponentFixture<DtColumnSelectorComponent>;
  let store: MockStore;
  let transformerService: DataTransformerService;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DtColumnSelectorComponent],
      providers: [
        provideMockStore({ initialState }),
        DataTransformerService,
      ],
    })
      .compileComponents();
    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(DtColumnSelectorComponent);
    component = fixture.componentInstance;

    transformerService = TestBed.inject(DataTransformerService);

    // Directly set the data$ input signal with mock data
    (component as any).transformer$ = signal(transformerService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
