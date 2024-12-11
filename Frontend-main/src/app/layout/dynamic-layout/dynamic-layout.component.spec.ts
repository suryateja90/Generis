import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KtdGridLayoutItem } from '@katoid/angular-grid-layout';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { signal } from '@angular/core';
import { AppState, initialAppState } from 'src/app/store/app.state';
import { DynamicLayoutComponent } from './dynamic-layout.component';
import { DynamicLayoutItem } from './dynamic-layout.model';

describe('DynamicLayoutComponent', () => {
  let component: DynamicLayoutComponent;
  let fixture: ComponentFixture<DynamicLayoutComponent>;
  let store: MockStore;

  const initialState: AppState = {
    ...initialAppState,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicLayoutComponent, // Import the standalone component
        StoreModule.forRoot({}), // Ensure the Store module is included
      ],
      providers: [provideMockStore({ initialState })]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(DynamicLayoutComponent);
    component = fixture.componentInstance;

    // Directly set the defaultLayout$ input signal with mock data
    const defaultLayout: DynamicLayoutItem[] = [
      { id: 'app-test-widget', x: 0, y: 0, w: 6, h: 6, parameters: { title: 'Title 1', subTitle: 'Subtitle 1', count: 1 }, },
      { id: 'app-echo', x: 6, y: 0, w: 6, h: 6, },
      { id: 'app-parameters-set', x: 0, y: 6, w: 6, h: 6, },
      { id: 'app-parameters-view', x: 6, y: 6, w: 6, h: 6, },
      { id: 'app-test-widget', x: 0, y: 12, w: 6, h: 6, parameters: { title: 'Title 2', subTitle: 'Subtitle 2', count: 2 }, },
    ];
    (component as any).defaultLayout$ = signal(defaultLayout);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map and un-map', () => {

    const defaultLayout: DynamicLayoutItem[] = [
      { id: 'app-test-widget', x: 0, y: 0, w: 6, h: 6, parameters: { title: 'Title 1', subTitle: 'Subtitle 1', count: 1 }, },
      { id: 'app-echo', x: 6, y: 0, w: 6, h: 6, },
      { id: 'app-parameters-set', x: 0, y: 6, w: 6, h: 6, },
      { id: 'app-parameters-view', x: 6, y: 6, w: 6, h: 6, },
      { id: 'app-test-widget', x: 0, y: 12, w: 6, h: 6, parameters: { title: 'Title 2', subTitle: 'Subtitle 2', count: 2 }, },
    ];
    console.log('defaultLayout: ' + JSON.stringify(defaultLayout));

    const transformed_array: KtdGridLayoutItem[] = defaultLayout.map((item: DynamicLayoutItem, index: number) => component.map(item, index));
    console.log('transformed_array: ' + JSON.stringify(transformed_array));

    const original_array: DynamicLayoutItem[] = transformed_array.map((item) => component.unmap(item));
    console.log('original_array: ' + JSON.stringify(original_array));

    expect(defaultLayout).toEqual(original_array);
  });
});
