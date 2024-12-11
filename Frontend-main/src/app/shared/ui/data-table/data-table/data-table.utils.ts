export const sortFn = (data1: unknown, data2: unknown, field: string, order: number) => {
    let value1 = data1[field];
    let value2 = data2[field];
    let result = null;
    if (value1 == null && value2 != null) result = -1;
    else if (value1 != null && value2 == null) result = 1;
    else if (value1 == null && value2 == null) result = 0;
    else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
    else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

    return order * result;
};

// Define a function to check for empty values (null, undefined, or empty string)
export const isEmptyValue = (value: unknown): boolean => value === null || value === undefined || value === '';

// Define a function to check for empty column
export const isEmptyColumn = (rows: unknown[], field: string): boolean => rows.map(item => item[field]).every(value => isEmptyValue(value));