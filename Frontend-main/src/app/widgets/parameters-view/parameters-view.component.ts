import { Component, computed, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { PrimeIcons } from 'primeng/api';
import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { setParameter } from 'src/app/store/parameters/parameters.actions';
import { SeguridadParameterModel } from 'src/shared/models/seguridad-parameter.model';
import { selectParameters } from '../../store/parameters/parameters.selectors';

@Component({
  selector: 'app-parameters-view',
  standalone: true,
  imports: [TableModule, ButtonModule,],
  templateUrl: './parameters-view.component.html',
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%; // Ensure the host takes full available space.
    }
  `],
})
@RegisterWidget('app-parameters-view', PrimeIcons.LIST)
export class ParametersViewComponent {

  parameters$ = input.required<any>({ alias: 'parameters' });

  public parametersData$ = this.store.selectSignal(selectParameters);

  // Computed signal to get keys
  public rows$ = computed(() => Object.keys(this.parametersData$() ?? {}).map(k => ({ application: k }))); // Convert keys of Record to Array

  // Get parameters for a specific application
  getParameters(application: string): Record<string, string> | undefined {
    return this.parametersData$()[application];
  }

  getKeys(obj: Record<string, unknown>): string[] {
    return Object.keys(obj);
  }

  public expandedRows: { [key: string]: boolean } = {};

  // ------------------------------------------------------------------------
  constructor(private store: Store) { }

  // ------------------------------------------------------------------------------------------------------------------------
  removeParameter(application: string, parameter: string) {
    const parameterData: SeguridadParameterModel = { application, parameter, value: null, };
    this.store.dispatch(setParameter({ parameter: parameterData }));
  }
}
