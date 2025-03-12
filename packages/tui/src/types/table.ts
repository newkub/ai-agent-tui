export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: T) => string;
}

export interface TableRow<T = unknown> {
  [key: string]: T;
}

export interface TableConfig<T = unknown> {
  columns: TableColumn<T>[];
  rows: TableRow<T>[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}