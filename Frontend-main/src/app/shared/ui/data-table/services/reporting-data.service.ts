/*

`reporting-data.service.ts` 

The `ReportingDataService` manages the lifecycle of report data, including fetching, updating, and handling state changes. 
It uses Angular's reactive signals and effects to keep the UI in sync with the application state managed by NgRx. 

*/

import { computed, effect, Injectable, signal } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, skip, takeWhile } from 'rxjs';
import { selectApplicationParameter, selectApplicationParameters } from 'src/app/store/parameters/parameters.selectors';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { setDefaultParameter, setParameter } from 'src/app/store/parameters/parameters.actions';
import { loadReportData, updateReportDataItems } from 'src/app/store/reporting/reporting.actions';
import { selectReportDataItems, selectReportDataLoading } from 'src/app/store/reporting/reporting.selectors';
import { SeguridadParameterModel } from 'src/shared/models/seguridad-parameter.model';
import { TableState } from '../data-table/data-table.models';
import { AbstractParametersService, AbstractParametersServiceConfigOptions } from './abstract-parameters.service';
import { DataOptions } from './data-transformer.service';

export interface ReportingDataServiceProcessMethods {
  data?: (items: unknown[]) => void;
  dataLoadingStatus?: (loading: boolean) => void;
  error?: (error: string) => void;
  dataOptions?: (options: DataOptions) => void;
}

export interface ReportingDataServiceConfigOptions extends ReportingDataServiceProcessMethods, AbstractParametersServiceConfigOptions {
}

@Injectable()
export class ReportingDataService extends AbstractParametersService {

  private processMethods: ReportingDataServiceProcessMethods = {
    data: (items: unknown[]) => { },
    dataLoadingStatus: (loading: boolean) => { },
    error: (error: string) => { },
    dataOptions: (options: DataOptions) => { },
  };
  private reportId: number;
  private dataLoadedComplete = false;

  private fixedReportKey$ = computed<string>(() => this.parameters$ ? this.parameters$()?.fixedReportKey : undefined);
  private selectedReportKeyParam$ = this.store.selectSignal(selectApplicationParameter('REPORTING', 'selectedReportKey'));
  private selectedReportKey = computed(() => Number(this.fixedReportKey$() ?? this.selectedReportKeyParam$()));
  private reportingParams$ = this.store.selectSignal(selectApplicationParameters('REPORTING'));
  private pageSizeParam$ = computed<string>(() => this.reportingParams$()?.[`pageSize.${this.selectedReportKey()}`]);
  private tableStateParam$ = computed<string>(() => this.reportingParams$()?.[`tableState.${this.selectedReportKey()}`] ?? 'null');
  private pageSize$ = computed(() => {
    const pageSize = this.pageSizeParam$();
    return pageSize ? Number(pageSize) : undefined;
  });
  private tableState$ = computed<TableState>(() => {
    const tableState = this.tableStateParam$();
    return tableState ? JSON.parse(tableState) : undefined;
  });
  private options$ = computed<DataOptions>(() => { return { pageSize: this.pageSize$(), tableState: this.tableState$() } });
  private dataItems$ = signal<unknown[]>(undefined);
  private dataLoading$ = signal<boolean>(false);

  constructor(private store: Store) {
    super();

    effect(() => {
      this.reportId = this.selectedReportKey();
      if (this.reportId) {
        this.dataLoadedComplete = false;

        this.store.dispatch(loadReportData({ reportId: this.reportId }));

        this.store.pipe(
          select(selectReportDataItems(this.reportId)),
          skip(1), takeUntilDestroyed(this.destroyRef), distinctUntilChanged(deepEqual),
          takeWhile(() => !this.dataLoadedComplete)
        ).subscribe((items: unknown[]) => this.dataItems$.set(items));

        this.store.pipe(
          select(selectReportDataLoading(this.reportId)),
          takeUntilDestroyed(this.destroyRef),
          takeWhile(() => !this.dataLoadedComplete),
        ).subscribe((loading: boolean) => this.dataLoading$.set(loading));
      }
    }, { allowSignalWrites: true });

    effect(() => {
      if (this.reportId) {
        const dataItems = this.dataItems$();
        this.processMethods.data(dataItems);
      }
      else {
        this.processMethods.error('No report selected.');
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const dataLoading = this.dataLoading$() ?? false;
      this.processMethods.dataLoadingStatus(dataLoading);
    }, { allowSignalWrites: true });

    effect(() => {
      const options = this.options$();
      this.processMethods.dataOptions(options);
    }, { allowSignalWrites: true });
  }

  // --------------------------------------------------------------------------
  public override config(options: ReportingDataServiceConfigOptions) {
    super.config(options);

    // Iterate over the process methods and update them if corresponding options are provided
    Object.keys(this.processMethods).forEach(method => {
      if (options[method]) {
        this.processMethods[method] = options[method];
      }
    });
  }

  // --------------------------------------------------------------------------
  public dataLoadCompleted = () => {
    this.dataLoadedComplete = true;
  }

  // --------------------------------------------------------------------------
  public updateReportDataItem = (dataKey: string, dataKeyId: string, item: unknown) => {
    if (this.dataLoadedComplete) {
      // Update the data in store
      this.store.dispatch(updateReportDataItems({ reportId: this.reportId, dataKey, dataKeyId, item }));
    }
  }

  // --------------------------------------------------------------------------
  public setParameterForReport = (parameter: string, value: string, isAdmin: boolean) => {
    const parameterData: SeguridadParameterModel = {
      application: 'REPORTING',
      parameter: `${parameter}.${this.selectedReportKey()}`,
      value,
    };
    const setParam = isAdmin ? setDefaultParameter : setParameter;
    this.store.dispatch(setParam({ parameter: parameterData }));
  }
}

// --------------------------------------------------------------------------
function deepEqual(a: any, b: any): boolean {
  if (typeof a !== typeof b) return false;

  if (typeof a !== 'object' || a === null || b === null) return a === b;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}