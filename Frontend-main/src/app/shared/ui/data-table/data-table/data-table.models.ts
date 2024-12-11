export interface ColumnState {
    hidden?: boolean;
    order?: number;
    width?: number;
}

export type ColumnsState = Record<string, ColumnState>;

export interface TableState {
    tableWidth?: number;
    columnsState?: ColumnsState;
}

export interface Cell {
    value?: unknown;
    formattedValue?: string;
    styleClass: string;
    highlight: boolean;
}

export interface ColumnOptions {
    field: string;
    header?: string;
    formattedField?: string;
    cellFormats?: string[];
}

export interface Column {
    field: string;
    header: string;
    formattedField: string; // Added a field for display-only formatted text to avoid affecting sorting.
    cellFormats: string[];
    headerCell: Cell;
    state?: ColumnState;
}

export function setColumn(options: ColumnOptions): Column {
    return {
        field: options.field,
        header: options.header ?? options.field,
        formattedField: options.formattedField ?? `_ff.${options.field}`,
        cellFormats: options.cellFormats ?? [],
        headerCell: { styleClass: '', highlight: false },
    };
}

export type Row = Record<string, Cell | unknown>;

export interface GroupingInfo {
    field?: string;
    expandedRowKeys: Record<string, boolean>;
}

export interface DataOptions {
    allowSelect?: boolean;
    pageSize?: number;
}

export interface Data extends DataOptions {
    orgColumns?: Column[];
    orgRows?: Row[];
    error?: string;
    selectedRow?: RowData;
    contextMenuSelectedRow?: RowData;
    dataKey?: string;
    tableWidth: number,
    fieldInfo: Record<string, FieldInformation>;
    fieldOrder: Record<string, number>;
    loading: boolean;
    columns: Column[];
    rows: Row[];
    pageSize: number;
    group: GroupingInfo;
}

export function setData(options?: DataOptions): Data {
    options ??= {};
    return {
        allowSelect: options.allowSelect ?? false,
        pageSize: options.pageSize ?? 10,
        tableWidth: 0,
        fieldInfo: {}, fieldOrder: {}, loading: false, columns: [], rows: [],
        group: { expandedRowKeys: {} }
    };
}

export interface FieldInformation {
    originalField: string;
    cellFormats: string[];
}

export interface RowData {
    dataKeyId: any;
    data: any;
}

export interface RowSelectEvent {
    originalEvent?: Event;
    rowData: RowData;
}

export interface ContextMenuSelectEvent {
    originalEvent?: Event;
    rowData: RowData;
}

export interface RowDoubleClickEvent {
    originalEvent?: Event;
    rowData: RowData;
}

export interface OrderListColumn {
    field: string;
    visible: boolean;
    defaultOrder?: number;
}

export interface ColumnSelector {
    title?: string;
    columns: OrderListColumn[];
    selection: OrderListColumn[];
    visible: boolean;
}
