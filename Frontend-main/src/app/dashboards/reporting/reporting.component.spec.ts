import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppState, initialAppState } from 'src/app/store/app.state';
import { ReportComponent } from './reporting.component';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let store: MockStore;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportComponent],
      providers: [provideMockStore({ initialState })]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
