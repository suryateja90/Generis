import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppState, initialAppState } from 'src/app/store/app.state';
import { DataTransformerService } from '../services/data-transformer.service';
import { DtCaptionComponent } from './dt-caption.component';

describe('DtCaptionComponent', () => {
  let component: DtCaptionComponent;
  let fixture: ComponentFixture<DtCaptionComponent>;
  let store: MockStore;
  let transformerService: DataTransformerService;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DtCaptionComponent],
      providers: [
        provideMockStore({ initialState }),
        DataTransformerService,
      ],
    })
      .compileComponents();
    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(DtCaptionComponent);
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
