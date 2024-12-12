/*
This class is designed to manage a data table's state and data flow in a reactive manner. 
It uses signals and effects to ensure that any changes to the underlying data or user interactions (like resizing columns) 
automatically update the UI. The methods provided allow for flexible configuration, data processing, and state management, 
making it a robust solution for handling dynamic tables in an application.
*/
import { computed, effect, Injectable, signal } from '@angular/core';

import { DomHandler } from 'primeng/dom';
import { TableColResizeEvent, TableColumnReorderEvent, TablePageEvent } from 'primeng/table';
import { DataTableComponent } from '../data-table/data-table.component';
import { Column, ColumnSelector, ColumnsState, ColumnState, Data, TableState } from '../data-table/data-table.models';
import { isEmptyColumn } from '../data-table/data-table.utils';
import { AbstractParametersService, AbstractParametersServiceConfigOptions } from './abstract-parameters.service';

export interface DataOptions {
  pageSize: number;
  tableState: TableState;
}

export interface DataTransformerServiceMethods {
  beforeProcessingItem?: (item: unknown) => unknown;
  beforeProcessingItems?: (items: unknown[]) => void;
  dataLoadCompleted?: () => void;
  updateReportDataItem?: (dataKey: string, dataKeyId: string, item: unknown) => void;
  setParameterForReport?: (parameter: string, value: string, isAdmin: boolean) => void,
}

export interface DataTransformerServiceConfigOptions extends DataTransformerServiceMethods, AbstractParametersServiceConfigOptions {
  dataRef: Data;
  dataTableRef: DataTableComponent;
}

@Injectable()
export class DataTransformerService extends AbstractParametersService {
  private dataRef: Data;
  private dataTableRef: DataTableComponent;

  private processMethods: DataTransformerServiceMethods = {
    beforeProcessingItem: (item: unknown): unknown => { return item; },
    beforeProcessingItems: (items: unknown[]) => { },
    dataLoadCompleted: () => { },
    updateReportDataItem: (dataKey: string, dataKeyId: string, item: unknown) => { },
    setParameterForReport: (parameter: string, value: string, isAdmin: boolean) => { },
  };

  private pageSize$ = signal<number>(10);
  private tableState$ = signal<TableState>({});
  private tableWidth$ = signal<number>(0);
  private firstColumnState = computed<ColumnState>(() => {
    // Retrieve the table state from the reactive parameter
    const tableState = this.tableState$();

    // Extract the columns state from the table state
    const columnsState = tableState?.columnsState ?? {};

    // Get the first column's state by accessing the first key of the columns state object
    const firstColumnKey = Object.keys(columnsState)?.[0];
    const firstColumnState = columnsState[firstColumnKey];

    return firstColumnState;
  });
  private defaultOrderChanged$ = computed<boolean>(() => this.firstColumnState()?.order !== undefined);
  private items$ = signal<unknown[]>([]);
  private indexedItems$ = signal<Record<string, unknown>>(undefined);
  private dataItems$ = computed<unknown[]>(() => {
    const indexedItems = this.indexedItems$();
    return indexedItems ? Object.values(indexedItems) : this.items$();
  });
  private columns$ = signal<Column[]>([]);
  private hiddenColumns$ = computed<boolean>(() => this.columns$().some(c => c.state.hidden === true));
  private orderedCols$ = signal<Column[]>([]);
  private columnsState$ = computed<ColumnsState>(() => this.orderedCols$().reduce((acc, item) => { acc[item.field] = item.state; return acc; }, {} as ColumnsState));
  private filteredCols$ = computed<Column[]>(() => {
    // Copy the ordered columns to avoid modifying the original array
    let cols = [...this.orderedCols$()];
    // Check if hidden columns flag is set, indicating columns can be hidden
    if (this.hiddenColumns$()) {
      // Filter the columns based on the flag for that column
      cols = cols.filter(col => !col.state.hidden);
    }
    return cols;
  });
  private dataKey$ = computed<string>(() => this.parameters$ ? this.parameters$()?.dataKey : undefined);

  // --------------------------------------------------------------------------
  constructor() {
    super();

    effect(() => {
      if (this.dataRef) {
        this.dataRef.pageSize = this.pageSize$();
      }
    });

    effect(() => {
      if (this.dataRef) {
        this.dataRef.dataKey = this.dataKey$();
      }
    });

    effect(() => {
      // Filter columns based on their original presence in the data
      const newCols = [...this.columns$()].filter(col => this.dataRef.fieldOrder[col.field] !== undefined);

      if (this.defaultOrderChanged$()) {
        newCols.sort((a, b) => (a.state.order ?? newCols.length) - (b.state.order ?? newCols.length + 1));
      }
      this.orderedCols$.set(newCols);
    }, { allowSignalWrites: true });

    effect(() => {
      if (this.dataRef) {
        this.dataRef.columns = this.filteredCols$();
      }
    });

    effect(() => {
      if (this.dataTableRef) {
        const tableWidth = this.tableWidth$();
        const filteredCols = this.filteredCols$();
        if (tableWidth > 0 && filteredCols?.length && this.dataTableRef.tableRef$()) {
          this.dataTableRef.tableRef$().destroyStyleElement();
          this.dataTableRef.tableRef$().tableWidthState = `${tableWidth}`;
          this.dataTableRef.tableRef$().columnWidthsState = filteredCols.map(col => col.state.width).join(',');
          this.dataTableRef.tableRef$().restoreColumnWidths();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  public override config(options: DataTransformerServiceConfigOptions) {
    super.config(options);

    // Iterate over the process methods and update them if corresponding options are provided
    Object.keys(this.processMethods).forEach(method => {
      if (options[method]) {
        this.processMethods[method] = options[method];
      }
    });

    // Ensure a DataRef is provided to manage data
    if (!options.dataRef) {
      throw new Error('DataRef is required.');
    }

    // Ensure a DataTableComponent is provided
    if (!options.dataTableRef) {
      throw new Error('DataTableComponent is required.');
    }

    // Set the initial values
    this.dataRef = options.dataRef;
    this.dataTableRef = options.dataTableRef;
  }

  // --------------------------------------------------------------------------
  public processData = (items: unknown[]) => {
    console.debug('processData:', items);
    // Validate and handle empty or nullish items array
    if (!items?.length) {
      this.items$.set([]); // Set data to empty array if no items
      this.dataRef.error = 'Something went wrong!';
      return;
    }

    this.processMethods.dataLoadCompleted();
    this.dataRef.group.expandedRowKeys = {};
    this.dataRef.error = null; // Reset any previous error

    // Extract field information from the first item
    this.extractFieldInformation(items);

    // Transform items using extracted field information
    this.transformItemsWithFields(items);
  }

  // --------------------------------------------------------------------------
  public processDataLoadingStatus = (loading: boolean) => {
    console.debug('processDataLoadingStatus:', loading);
    this.dataRef.loading = loading;
  }

  // --------------------------------------------------------------------------
  public processError = (error: string) => {
    console.debug('processError:', error);
    this.dataRef.error = error;
  }

  // --------------------------------------------------------------------------
  public processDataOptions = (options: DataOptions) => {
    console.debug('processDataOptions:', options);
    // default values
    options.pageSize ??= 10;
    options.tableState ??= {};

    // set values
    const { pageSize, tableState } = options;
    this.pageSize$.set(pageSize);
    this.tableState$.set(tableState);
    this.tableWidth$.set(tableState.tableWidth);
  }

  // --------------------------------------------------------------------------
  public upsertData = (items: unknown[]) => {
    console.debug('upsertData:', items);
    const dataKey = this.dataKey$();
    if (dataKey) { items.forEach(item => this.upsertDataItem(dataKey, item)); }
  }

  // --------------------------------------------------------------------------
  public getColumnsForSelection() {
    return (this.orderedCols$() ?? [])
      .map(c => ({ field: c.field, visible: !c.state.hidden, defaultOrder: this.dataRef.fieldOrder[c.field] }))
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public useDefaultTableState() {
    this.resetColumnWidths(false);
    this.clearTableState();
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public hideEmptyColumns() {
    const orderedCols = [...this.orderedCols$()];
    orderedCols.forEach(col => {
      const colState = this.getColumnState(col.field);
      if (colState) { colState.hidden = isEmptyColumn(this.dataItems$(), col.field); }
    });
    this.orderedCols$.set(orderedCols);
    this.saveTableState();
  }

  // --------------------------------------------------------------------------
  public resetTableState() {
    this.resetHiddenColumns(false);
    this.resetColumnOrder(false);
    this.resetColumnWidths(false);
    this.saveTableState();
  }

  // --------------------------------------------------------------------------
  public resetHiddenColumns(saveState = true) {
    const orderedCols = [...this.orderedCols$()];
    orderedCols.forEach(col => {
      const colState = this.getColumnState(col.field);
      if (colState) { colState.hidden = undefined; }
    });
    this.orderedCols$.set(orderedCols);
    if (saveState) { this.saveTableState(); }
  }

  // --------------------------------------------------------------------------
  public resetColumnWidths(saveState = true) {
    this.tableWidth$.set(undefined);
    this.orderedCols$().forEach(col => {
      const colState = this.getColumnState(col.field);
      if (colState) { colState.width = undefined; }
    });
    if (saveState) { this.saveTableState(); }
    this.dataTableRef.tableRef$().setResizeTableWidth('100%');
    this.dataTableRef.tableRef$().destroyStyleElement();
  }

  // --------------------------------------------------------------------------
  public resetColumnOrder(saveState = true) {
    this.orderedCols$().forEach(col => {
      const colState = this.getColumnState(col.field);
      if (colState) { colState.order = undefined; }
    });
    if (saveState) { this.saveTableState(); }
  }

  // --------------------------------------------------------------------------
  public pageChange(event: TablePageEvent) {
    const newPageSize = event.rows;
    if (newPageSize && newPageSize !== this.pageSize$()) {
      this.processMethods.setParameterForReport('pageSize', newPageSize.toString(), false);
    }
  }

  // --------------------------------------------------------------------------
  public columnResize(event: TableColResizeEvent) {
    const el = this.dataTableRef.tableRef$()?.tableViewChild?.nativeElement;
    this.tableWidth$.set(el ? DomHandler.getOuterWidth(el) : undefined);

    const container = this.dataTableRef.tableRef$()?.containerViewChild?.nativeElement;
    if (container) {
      const headers = DomHandler.find(container, '.p-datatable-thead > tr > th');
      headers.forEach(header => {
        const colState = this.getColumnState(header.id);
        if (colState) { colState.width = DomHandler.getOuterWidth(header); }
      });
      this.saveTableState();
    }
  }

  // --------------------------------------------------------------------------
  public columnReorder(event: TableColumnReorderEvent) {
    this.orderedCols$.set(event.columns);

    this.orderedCols$().forEach((col: Column, index: number) => {
      const colState = this.getColumnState(col.field);
      if (colState) { colState.order = index + 1; }
    });
    this.saveTableState();
  }

  // ------------------------------------------------------------------------
  public onApplyColumnSelection(columnSelector: ColumnSelector, isAdmin = false) {
    const cols = [...this.columns$()];
    columnSelector.columns.forEach((c, index) => {
      const colState = this.getColumnState(c.field);
      if (colState) {
        colState.order = index + 1;
        colState.hidden = !c.visible ? true : undefined;
      }
    });
    this.columns$.set(cols);
    this.saveTableState(isAdmin);
    columnSelector.columns = [];
    columnSelector.visible = false; // hide dialog box 
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private getColumnState(field: string) {
    const resizeCol = this.orderedCols$().find(col => col.field === field);
    if (resizeCol) { resizeCol.state = resizeCol.state ?? {}; }
    return resizeCol?.state;
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private saveTableState(isAdmin = false) {
    const tableState: TableState = { tableWidth: this.tableWidth$(), columnsState: this.columnsState$() };
    this.processMethods.setParameterForReport('tableState', JSON.stringify(tableState), isAdmin);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private clearTableState(isAdmin = false) {
    this.processMethods.setParameterForReport('tableState', null, isAdmin);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private extractFieldInformation(items: unknown[]): void {
    // Initialize an empty object to store processed fields with formats
    this.dataRef.fieldInfo = {};
    this.dataRef.fieldOrder = {};

    // Check if the provided items array is valid and not empty (nullish check)
    if (items?.length) {
      // Get the first item as a reference to extract field names
      const referenceItem = items[0];

      // Loop through each property (field) in the first item
      Object.keys(referenceItem).forEach((field, index) => {
        // Split the field name to separate header and potential formatting
        const [header, ...cellFormats] = field.split('|');

        const fieldName = header.trim();
        this.dataRef.fieldOrder[fieldName] = index;

        // Check if formatting information exists
        if (cellFormats.length) {
          // Store processed field information with trimming
          this.dataRef.fieldInfo[fieldName] = {
            originalField: field,
            cellFormats: cellFormats.map(format => format.trim()) // Trim formatting entries as well
          };
        }
      });
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private transformItemsWithFields(items: unknown[]): void {
    // Check if the provided items array is valid and not empty (nullish check)
    if (items?.length) {
      // Process each item to use the field names
      const data = items.map((item: any) => {
        const processedItem = { ...item }; // Create a shallow copy to avoid mutations

        // Loop through each field mapping
        Object.keys(this.dataRef.fieldInfo).forEach(fieldName => {
          const originalFieldName = this.dataRef.fieldInfo[fieldName].originalField;

          // Use the original field name to access the value and assign it to the name
          processedItem[fieldName] = processedItem[originalFieldName];
          delete processedItem[originalFieldName]; // Remove the original field after copying
        });

        return this.processMethods.beforeProcessingItem(processedItem);
      });

      this.processMethods.beforeProcessingItems(data);

      this.setColumns(data);
      this.dataTableRef.setRows(data);
      this.setDataItems(data);
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private setColumns(dataItems: unknown[]) {
    const tableState = this.tableState$();
    this.tableWidth$.set(tableState.tableWidth);

    const cols = this.dataTableRef.generateColumns(dataItems);

    // Loop through each column definition
    cols.forEach(col => {
      // Initialize column state, prioritizing existing state from tableState
      // If no existing state exists for the column, create a new empty object
      col.state = { ...(tableState.columnsState?.[col.field] ?? {}) };
    });

    this.columns$.set(cols);
    this.dataTableRef.setColumns(cols);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private setDataItems(data: unknown[]): void {
    // Get the key used for indexing
    const indexKey = this.dataKey$();

    if (indexKey) {
      // Create an indexed object efficiently using Object.fromEntries
      const indexedData = Object.fromEntries(data.map(item => [item[indexKey], item]));

      // Update the state with indexed data
      this.indexedItems$.set(indexedData);

      // Clear the original data (optional, consider if needed for future use)
      this.items$.set([]);
    }
    else {
      this.items$.set(data);
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private upsertDataItem(dataKey: string, item: unknown) {
    item = this.processMethods.beforeProcessingItem({ ...(item as any) });

    const dataKeyValue = item[dataKey];

    // Update the indexed data efficiently using an immutable update approach
    this.indexedItems$.update(indexedItems => ({ ...indexedItems, [dataKeyValue]: item }));

    // Update the data in store
    this.processMethods.updateReportDataItem(dataKey, dataKeyValue, item);

    // Update the table rows efficiently by finding the existing row or creating a new one
    this.dataTableRef.upsertRow(item);

    this.processMethods.beforeProcessingItems(this.dataRef.rows);

    this.dataTableRef.refreshTable();
  }
}
