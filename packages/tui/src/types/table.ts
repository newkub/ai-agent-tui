export interface TableOptions {
  padding?: number;
  border?: boolean;
  headerColor?: string;
  rowColor?: string;
}

export interface TableColumn {
  key: string;
  header: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
}
