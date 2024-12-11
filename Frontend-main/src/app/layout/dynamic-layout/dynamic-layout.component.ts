
import { Component, computed, effect, input, signal, Type, viewChild, viewChildren, ViewContainerRef } from '@angular/core';
import { ktdGridCompact, KtdGridCompactType, KtdGridComponent, KtdGridItemComponent, KtdGridLayout, KtdGridLayoutItem } from '@katoid/angular-grid-layout';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { DatePipe, NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { performDynamicLayoutAction, setParameter } from 'src/app/store/parameters/parameters.actions';
import { selectApplicationParameters, selectDynamicLayoutAction, selectIsDraggable, selectParametersLoading } from 'src/app/store/parameters/parameters.selectors';
import { SeguridadParameterModel } from 'src/shared/models/seguridad-parameter.model';
import { ComponentRegistry, DynamicLayoutItem } from './dynamic-layout.model';
import { ReportingDataService } from 'src/app/shared/ui/data-table/services/reporting-data.service';

@Component({
  selector: 'app-dynamic-layout',
  templateUrl: './dynamic-layout.component.html',
  styleUrl: './dynamic-layout.component.scss',
  standalone: true,
  imports: [NgClass, KtdGridComponent, KtdGridItemComponent, ButtonModule, RippleModule, TooltipModule, DialogModule, ReactiveFormsModule, FloatLabelModule, DropdownModule],
  providers: [DatePipe, ReportingDataService] // Provide DatePipe here
})
export class DynamicLayoutComponent {

  name$ = input.required<string>({ alias: 'name' });

  // default layout layout sent by parameters
  defaultLayout$ = input.required<KtdGridLayout, DynamicLayoutItem[]>({
    alias: 'defaultLayout',
    transform: (items): KtdGridLayout => items.map((item: DynamicLayoutItem, index: number) => this.map(item, index))
  });

  // tailored layout layout saved on NgRX store
  public parametersLoading$ = this.store.selectSignal(selectParametersLoading);

  private appParams$ = this.store.selectSignal(selectApplicationParameters('dynamic-layout'));
  private savedLayoutParam$ = computed(() => this.appParams$()?.[this.name$()]);

  private savedLayout$ = computed<KtdGridLayout>(() => {
    const parametersLoading = this.parametersLoading$();
    if (!parametersLoading) {
      const savedLayout = this.savedLayoutParam$();
      return savedLayout ? JSON.parse(savedLayout).map((item: DynamicLayoutItem, index: number) => this.map(item, index)) : []; // must be an empty array to know when there are no items (first time) vs not being populated yet    
    }
  });

  // main layout object
  public layout$ = signal<KtdGridLayout>(null);

  // Dictionary to store items parameters for when saving
  private layoutDict: Record<string, DynamicLayoutItem> = {};
  private gridRef$ = viewChild('gridRef', { read: KtdGridComponent });
  private containers$ = viewChildren('dynamicContainer', { read: ViewContainerRef });

  public autoResize = signal(true);

  public compactType: KtdGridCompactType = 'vertical';
  public cols = 12;
  public rowHeight = 50;
  public gap = 24;

  isDraggable$ = this.store.selectSignal(selectIsDraggable);

  widgets$ = computed<string[]>(() => Object.keys(ComponentRegistry));
  dynamicLayoutAction$ = this.store.selectSignal(selectDynamicLayoutAction);
  addWidgetDialogVisible = false;

  addWidgetForm = this.fb.group({
    widget: [undefined, Validators.required],
  });

  private resizeObserver: ResizeObserver;

  // ------------------------------------------------------------------------
  constructor(private datePipe: DatePipe,
    private fb: FormBuilder,
    private store: Store) {

    // execute action being invoked for the layout
    effect(() => {
      const dynamicLayoutAction = this.dynamicLayoutAction$();
      // Proceed if dynamicLayoutAction and its action property are present
      if (dynamicLayoutAction) {
        console.debug(`The '${dynamicLayoutAction}' action was executed on the '${this.name$()}' component's layout.`);
        switch (dynamicLayoutAction) {
          case 'reset-layout':
            // reset to default layout
            this.onLayoutUpdated(null);
            break;

          case 'add-widget':
            // show dialog box to select and add widget to the layout
            this.addWidgetForm.reset();
            this.addWidgetDialogVisible = true;
            break;
        }
        // when subscribe to signals that selects from the NgRx store, the component picks up the last stored value on initialization, triggering actions on startup
        // so lets reset the dynamicLayoutAction state to null automatically after handling an action so the action gets consumed once and isn’t retained for the next component initialization
        this.store.dispatch(performDynamicLayoutAction({ action: null }));
      }
    }, { allowSignalWrites: true });

    // pick either the saved layout or the default, on that order
    effect(() => {
      if (!this.layout$()) {
        const savedLayout = this.savedLayout$();
        if (savedLayout) {
          this.layout$.set(savedLayout.length ? savedLayout : (this.defaultLayout$() ?? []));
        }
      }
    }, { allowSignalWrites: true });

    // trigger the component creation once the containers$ signal marks as populated
    effect(() => {
      const containers = this.containers$();
      const layout = this.layout$();
      if (containers && layout?.length) {
        containers.forEach((container, index) => {
          // Exit if the container already has a child component
          // Ensure only one component instance is created within the container

          if (container.length > 0) { return; } // Prevent creating duplicate components

          const item = layout[index];
          const componentKey = item.id.split('.')[0]; // Get the component key before the period
          const componentType = ComponentRegistry[componentKey]; // Retrieve component from registry

          // Set the parameters input (all widgets must have required parameters input)
          if (componentType) {
            const componentRef = container.createComponent(componentType as Type<unknown>);
            const defaultParameters = (componentRef.instance as any).defaultParameters;
            const parameters = this.layoutDict[item.id]?.parameters ?? defaultParameters;
            componentRef.setInput('parameters', parameters);
          } else {
            console.warn(`No component registered for widget id: ${componentKey}`);
          }
        });

      }
    });

    // Effect to observe resize for ktd-grid's native element and resize the grid
    effect(() => {
      if (!this.autoResize()) return null;

      const resizeHandler = () => this.gridRef$()?.resize(); // define an inline function that resizes the grid whenever a window event is triggered.

      const element = (this.gridRef$() as any)?.elementRef?.nativeElement;
      if (element) {
        this.resizeObserver = new ResizeObserver(resizeHandler);
        this.resizeObserver.observe(element);
      }

      // Cleanup the resize observer when the effect re-runs
      return () => {
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
      };

    });

  }

  // ------------------------------------------------------------------------
  // save the layout to NgRX store and backend persistence
  onLayoutUpdated(newLayout: KtdGridLayoutItem[]) {
    this.layout$.set(newLayout ?? this.defaultLayout$() ?? []); // Set the layout based on the katoid/angular-grid-layout examples.

    // mutate newLayout to a similar object but with the component key instead of the full id
    const updatedLayout: DynamicLayoutItem[] = newLayout?.map((item) => this.unmap(item));

    // save this layout according it's dashboard name
    const parameterData: SeguridadParameterModel = {
      application: 'dynamic-layout',
      parameter: this.name$(),
      value: JSON.stringify(updatedLayout),
    };
    this.store.dispatch(setParameter({ parameter: parameterData }));
  }

  onAddItem() {
    if (this.addWidgetForm.valid) {
      const { widget } = this.addWidgetForm.value;
      const layout = this.layout$();
      // Parameters should be customized for each widget.
      const parameters = widget === 'app-test-widget' ? { title: 'My Title 1', subTitle: 'My Subtitle 1', count: 1 } : undefined; // TODO: Improve implementation and handle more widgets.
      const item: DynamicLayoutItem = { id: widget, x: -1, y: -1, w: 6, h: 3, parameters };
      const newLayout = ktdGridCompact([this.map(item, layout.length), ...layout], this.compactType, this.cols);
      this.onLayoutUpdated(newLayout);
      this.addWidgetDialogVisible = false;
    }
  }

  onRemoveItem(item: KtdGridLayoutItem) {
    const newLayout: KtdGridLayoutItem[] = this.layout$().filter(i => i.id !== item.id);
    this.onLayoutUpdated(newLayout);
  }

  onConfigureItem(item: KtdGridLayoutItem) {
    // this must allow grid column selections
  }

  // DynamicLayoutItem to KtdGridLayoutItem
  public map(item: DynamicLayoutItem, index: number): KtdGridLayoutItem {
    const uniqueDateTime = this.datePipe.transform(new Date(), 'yyyyMMddHHmmssSSS');
    const key = `${item.id}.${index}.${uniqueDateTime}`; // Ensure key uniqueness using index and date-time
    this.layoutDict[key] = item; // Store the original item in the dictionary for future & quick lookup (mostly parameters)
    return { id: key, x: item.x, y: item.y, w: item.w, h: item.h, }
  }

  // KtdGridLayoutItem to DynamicLayoutItem
  public unmap(item: KtdGridLayoutItem): DynamicLayoutItem {
    const original = this.layoutDict[item.id]; // retrieve the original parameters as arrived from store/default
    const updated: DynamicLayoutItem = { id: item.id.split('.')[0], x: item.x, y: item.y, w: item.w, h: item.h };
    return { ...original, ...updated }; // merge them causing the updated ones to overwrite the original ones, but preserve original extra parameters
  }

}
