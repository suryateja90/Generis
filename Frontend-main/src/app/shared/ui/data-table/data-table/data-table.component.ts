/*
`DataTableComponent` manages and manipulates data for a table in the application. This component handles various functionalities such as:

- Formatting Data: It applies different formatting styles (e.g., currency, date, time) to cell values based on predefined formats.
- Sorting and Filtering: It supports sorting of the table data by columns and can handle filtering operations.
- Row Manipulation: It includes methods to update or add rows to the table while maintaining formatted values.
- Event Handling: The component listens for events like page changes, column resizing, reordering, and row selections, and emits appropriate actions based on these events.

This component is the solution for managing complex data interactions in data tables, ensuring that data presentation aligns with user-defined formats and behaviors.
*/

import { DatePipe, DecimalPipe, NgClass, NgTemplateOutlet, PercentPipe } from '@angular/common';
import { Component, contentChild, input, output, TemplateRef, viewChild } from '@angular/core';
import { FilterMetadata, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Table, TableColResizeEvent, TableColumnReorderEvent, TableContextMenuSelectEvent, TableModule, TablePageEvent, TableRowSelectEvent } from 'primeng/table';

import { Cell, Column, ContextMenuSelectEvent, Data, Row, RowDoubleClickEvent, RowSelectEvent, setColumn } from './data-table.models';
import { sortFn } from './data-table.utils';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  standalone: true,
  imports: [TableModule, ButtonModule, RippleModule, NgClass, NgTemplateOutlet,],
  providers: [
    PercentPipe, DecimalPipe, DatePipe,
  ],
})
export class DataTableComponent {

  data$ = input.required<Data>({ alias: 'data' });

  pageChange$ = output<TablePageEvent>({ alias: 'pageChange' });
  columnResize$ = output<TableColResizeEvent>({ alias: 'columnResize' });
  columnReorder$ = output<TableColumnReorderEvent>({ alias: 'columnReorder' });

  tableRef$ = viewChild('tableRef', { read: Table });

  captionTemplate$ = contentChild('captionTemplate', { read: TemplateRef });

  private isSorted: boolean = undefined;
  private sortField: string = undefined;

  // --------------------------------------------------------------------------
  // style and format container for efficient recovery
  private static StyleFormatActionsDict: Record<string, (cell: Cell) => void> = {};

  // --------------------------------------------------------------------------
  constructor(
    private datePipe: DatePipe,
    private percentPipe: PercentPipe,
    private decimalPipe: DecimalPipe,
  ) {
    // store the format and style actions 
    this.createStyleFormatActionsDict();
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private createStyleFormatActionsDict() {

    DataTableComponent.StyleFormatActionsDict['red'] = (cell: Cell) => cell.styleClass += 'text-red-500 ';
    DataTableComponent.StyleFormatActionsDict['green'] = (cell: Cell) => cell.styleClass += 'text-green-500 ';
    DataTableComponent.StyleFormatActionsDict['blue'] = (cell: Cell) => cell.styleClass += 'text-blue-500 ';

    DataTableComponent.StyleFormatActionsDict['bold'] = (cell: Cell) => cell.styleClass += 'font-bold ';
    DataTableComponent.StyleFormatActionsDict['italic'] = (cell: Cell) => cell.styleClass += 'font-italic ';

    DataTableComponent.StyleFormatActionsDict['left'] = (cell: Cell) => cell.styleClass += 'text-left ';
    DataTableComponent.StyleFormatActionsDict['center'] = (cell: Cell) => cell.styleClass += 'text-center ';
    DataTableComponent.StyleFormatActionsDict['right'] = (cell: Cell) => cell.styleClass += 'text-right ';

    DataTableComponent.StyleFormatActionsDict['percent'] = (cell: Cell) => { cell.formattedValue = this.percentPipe.transform(cell.formattedValue, '1.1', 'en'); };
    DataTableComponent.StyleFormatActionsDict['integer'] = (cell: Cell) => { cell.formattedValue = this.decimalPipe.transform(cell.formattedValue, '1.0-0', 'en'); };
    DataTableComponent.StyleFormatActionsDict['float2'] = (cell: Cell) => { cell.formattedValue = this.decimalPipe.transform(cell.formattedValue, '1.2-2', 'en'); };
    DataTableComponent.StyleFormatActionsDict['float4'] = (cell: Cell) => { cell.formattedValue = this.decimalPipe.transform(cell.formattedValue, '1.4-4', 'en'); };
    DataTableComponent.StyleFormatActionsDict['price2'] = (cell: Cell) => { cell.formattedValue = this.decimalPipe.transform(cell.formattedValue, '1.0-2', 'en'); };
    DataTableComponent.StyleFormatActionsDict['price4'] = (cell: Cell) => { cell.formattedValue = this.decimalPipe.transform(cell.formattedValue, '1.2-4', 'en'); };

    DataTableComponent.StyleFormatActionsDict['date'] = (cell: Cell) => { cell.formattedValue = this.datePipe.transform(cell.formattedValue, 'mediumDate'); };
    DataTableComponent.StyleFormatActionsDict['time'] = (cell: Cell) => { cell.formattedValue = this.datePipe.transform(cell.formattedValue, 'shortTime'); };
    DataTableComponent.StyleFormatActionsDict['datetime'] = (cell: Cell) => { cell.formattedValue = this.datePipe.transform(cell.formattedValue, 'short'); };

    DataTableComponent.StyleFormatActionsDict['pnl'] = (cell: Cell) => {
      const value = Number(cell.value);
      value < 0 ? DataTableComponent.StyleFormatActionsDict['red'](cell) : value > 0 ? DataTableComponent.StyleFormatActionsDict['green'](cell) : '';
    };

  }

  // --------------------------------------------------------------------------
  public tablePageChange(event: TablePageEvent) {
    this.pageChange$.emit(event);
  }

  // --------------------------------------------------------------------------
  public tableSort(event: SortEvent) {
    if (this.sortField !== event.field || this.isSorted === null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted === true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted === false) {
      this.sortField = null;
      this.isSorted = null;
      this.setRows();
      this.resetSort();
    }
  }

  // --------------------------------------------------------------------------
  public tableColumnResize(event: TableColResizeEvent) {
    this.columnResize$.emit(event);
  }

  // --------------------------------------------------------------------------
  public tableColumnReorder(event: TableColumnReorderEvent) {
    this.columnReorder$.emit(event);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public tableContextMenuSelect(event: TableContextMenuSelectEvent) {
    const contextMenuSelectEvent: ContextMenuSelectEvent = {
      originalEvent: event.originalEvent,
      rowData: { dataKeyId: event.data[this.data$().dataKey], data: event.data }
    };
    //this.onContextMenuSelect(contextMenuSelectEvent);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public tableRowSelect(event: TableRowSelectEvent) {
    const rowSelectEvent: RowSelectEvent = {
      originalEvent: event.originalEvent,
      rowData: { dataKeyId: event.data[this.data$().dataKey], data: event.data }
    }
    //this.onRowSelect(rowSelectEvent);
  }

  // --------------------------------------------------------------------------
  public tableRowDoubleClick(event: Event, rowData: any) {
    const rowDoubleClickEvent: RowDoubleClickEvent = {
      originalEvent: event,
      rowData: { dataKeyId: rowData[this.data$().dataKey], data: rowData }
    };
    //this.onRowDoubleClick(rowDoubleClickEvent);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public calculateGroupRowCount(groupValue: unknown): number {
    if (!this.data$().group.field || !this.tableRef$()?.value) {
      return 0; // No grouping or no data available
    }

    return this.tableRef$()?.value.filter(item => item[this.data$().group.field] === groupValue).length;
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public isLastRowOfPage(rowIndex: number): boolean {
    return rowIndex === this.tableRef$()?._first + this.tableRef$()?._rows - 1;
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public isGroupMasterRow(rowData: unknown): boolean {
    const masterRow = this.getGroupMasterRow(rowData);
    return masterRow?.[this.data$().dataKey] === rowData[this.data$().dataKey]
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public getGroupMasterRow(rowData: unknown): unknown {
    return this.getMasterRowForGroup(rowData[this.data$().group.field]);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private getMasterRowForGroup(groupValue: unknown): unknown {
    if (!this.data$().group.field || !this.tableRef$()?.value) {
      return undefined; // No grouping or no data available
    }

    return this.tableRef$()?.value.find(item => item[this.data$().group.field] === groupValue);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public refreshTable() {
    // Check if the table is sorted or filtered
    const tableRef = this.tableRef$();
    if (tableRef) {

      // Sort the data if necessary
      if (this.isSorted === true || this.isSorted === false) {
        this.sortTableData({
          data: tableRef.value,
          mode: tableRef.sortMode,
          field: tableRef.sortField,
          order: tableRef.sortOrder
        });
      }

      // Filter the data if necessary
      if (this.tableHasFilter(tableRef)) {
        tableRef.restoringFilter = true;
        tableRef._filter();
      }
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public generateColumns(dataItems: unknown[]): Column[] {
    let cols: Column[];
    if (dataItems?.length) {
      const firstItem = dataItems[0];

      const fields = Object.keys(firstItem);
      fields.sort((a, b) => (this.data$().fieldOrder[a] ?? fields.length) - (this.data$().fieldOrder[b] ?? fields.length + 1));

      cols = fields.map((fieldName, index) => {
        let col = setColumn({
          field: fieldName,
          formattedField: `_ff.${index}.${fieldName}`,
          cellFormats: this.data$().fieldInfo[fieldName]?.cellFormats ?? []
        });

        // Keep formats as the SQL user indicated, just trim them to make sure they exist
        const alignmentFormats = col.cellFormats
          .map(format => format.trim())
          .filter(format => ['left', 'center', 'right'].includes(format));
        for (const format of alignmentFormats) {
          const action = DataTableComponent.StyleFormatActionsDict[format];
          action ? action(col.headerCell) : col.headerCell.styleClass += `${format} `;
        }

        return col;
      });
    } else {
      cols = []; // Empty array if no data
    }

    return cols;
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public setColumns(cols: Column[]) {
    if (cols) {
      this.data$().orgColumns = cols;
    }
    this.data$().columns = [...this.data$().orgColumns];
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public setRows(dataItems?: unknown[]): void {
    if (dataItems) {
      // This method transforms raw data into an array of processed rows.
      this.data$().orgRows = dataItems.map(item => this.formattedRowItem(item));
    }
    this.data$().rows = [...this.data$().orgRows];
  }

  // ------------------------------------------------------------------------------------------------------------------------
  public upsertRow(row: unknown) {
    if (this.data$().orgRows) {
      this.upsertRowItem(this.data$().orgRows, row);
    }
    this.upsertRowItem(this.data$().rows, row);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private sortTableData(event: SortEvent) {
    event.data.sort((data1, data2) => sortFn(data1, data2, event.field, event.order));
    this.sortField = event.field;
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private upsertRowItem(rows: Row[], newRow: unknown) {
    const dataKey = this.data$().dataKey;
    const dataKeyValue = newRow[dataKey];

    // Find the existing row based on the dataKeyValue
    const existingRow = rows.find(row => row[dataKey] === dataKeyValue);

    // Format the new row data
    const formattedNewRow = this.formattedRowItem(newRow);

    // Update or add the row based on its existence
    if (existingRow) {
      this.updateRow(existingRow, formattedNewRow);
    } else {
      this.addRow(rows, formattedNewRow);
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private updateRow(existingRow: Row, newRow: Row): void {
    const updatedRow = { ...existingRow }; // Create a copy of the existing row

    if (this.data$().orgColumns) {
      // Loop through each column definition
      this.data$().orgColumns.forEach(col => {
        // Check if the value in the formatted row is different from the existing row
        if (newRow[col.field] !== existingRow[col.field]) {
          // Update the field value and formatted field value in the updated row
          updatedRow[col.field] = newRow[col.field];
          updatedRow[col.formattedField] = newRow[col.formattedField];

          // Highlight the updated cell
          this.highlightCell(updatedRow[col.formattedField] as Cell);
        }
      });
    }

    Object.assign(existingRow, updatedRow);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private addRow(rows: Row[], newRow: Row): void {
    if (this.data$().orgColumns) {
      // Loop through each column definition, highlight the entire row
      this.data$().orgColumns.forEach(col => this.highlightCell(newRow[col.formattedField] as Cell));
    }
    // Add a new row with formatted values
    rows.push(newRow);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private highlightCell(cell: Cell): void {
    cell.highlight = true;

    // Remove the highlight after a certain time
    setTimeout(() => { cell.highlight = false; }, 500);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private formattedRowItem(item: unknown): Row {
    const row: Row = {}; // Create an empty row object

    if (this.data$().orgColumns) {
      // Loop through each column definition
      this.data$().orgColumns.forEach(col => {
        row[col.field] = item[col.field]; // Set raw data value for the field
        row[col.formattedField] = this.generateCell(item[col.field], col.cellFormats); // Generate formatted cell data
      });
    }

    return row;
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private generateCell(value: unknown, colCellFormats: string[]): Cell {

    // 1. Extract value and formats, handling string values with optional formats
    let cellValue: unknown = value;
    let cellFormats: string[] = [...colCellFormats]; // Copy to avoid mutations

    if (typeof value === 'string') {
      const [rawValue, ...rawFormats] = value.split('|');
      cellValue = rawValue;
      if (rawFormats.length > 0) {
        cellFormats = [...rawFormats];
      }
    }

    // 2. Format value and build style classes
    let cell: Cell = { value: cellValue, formattedValue: cellValue?.toString(), styleClass: '', highlight: false };

    // 3. Keep formats as the SQL user indicated, just trim them to make sure they exist
    for (const format of cellFormats.map(format => format.trim())) {
      const action = DataTableComponent.StyleFormatActionsDict[format];
      action ? action(cell) : cell.styleClass += `${format} `; // allow the SQL user to specify non-standard classess (let's assume the risk of injecting invalid styles)      
    }

    // 4. Return the formatted cell object    
    return cell;
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private resetSort() {
    if (this.tableRef$()) {
      this.tableRef$().sortField = null;
      this.tableRef$().sortOrder = null;
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private tableHasFilter(tableRef: Table): boolean {
    // Check if table reference is defined and has filters property
    if (!tableRef || !tableRef.filters) {
      return false;
    }

    // Iterate over filters and check if any filter is applied
    for (const prop in tableRef.filters) {
      if (this.tableHasFilterForField(tableRef, prop)) {
        return true;
      }
    }

    return false;
  }

  // ------------------------------------------------------------------------------------------------------------------------
  private tableHasFilterForField(tableRef: Table, field: string): boolean {
    // Check if the table reference is available and if there's a filter for the specified field.
    const fieldFilter = tableRef?.filters[field];

    // If a filter exists, determine:
    // - For array filters, check if the first filter value is not blank.
    // - For non-array filters, check if the value itself is not blank.
    return fieldFilter && (
      Array.isArray(fieldFilter) ?
        !tableRef?.isFilterBlank((<FilterMetadata[]>fieldFilter)[0].value) :
        !tableRef?.isFilterBlank(fieldFilter.value)
    );
  }
}
