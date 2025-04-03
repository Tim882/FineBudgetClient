interface Column {
    id: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'range';
    filterable?: boolean;
    sortable?: boolean;
    width?: string | number;
    minWidth?: string | number;
    align?: 'left' | 'center' | 'right';
    selectOptions?: { value: any; label: string }[];
    filterComponent?: React.ReactNode; // Кастомный компонент фильтра
}