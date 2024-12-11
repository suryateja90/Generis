import { DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppState, initialAppState } from 'src/app/store/app.state';
import { ReportingDataSaveDialogComponent } from './reporting-data-save-dialog.component';

describe('ReportingDataSaveDialogComponent', () => {
  let component: ReportingDataSaveDialogComponent;
  let fixture: ComponentFixture<ReportingDataSaveDialogComponent>;
  let store: MockStore;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportingDataSaveDialogComponent],
      providers: [
        provideMockStore({ initialState }),
        PercentPipe, DecimalPipe, DatePipe,
      ]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(ReportingDataSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
