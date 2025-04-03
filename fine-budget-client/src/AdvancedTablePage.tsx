import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Toolbar,
  Typography,
  Tooltip,
  Popover,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const RangeFilter = ({ value, onChange }: { value: any, onChange: (value: any) => void }) => (
  <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
    <TextField
      label="От"
      type="number"
      value={value?.min || ''}
      onChange={(e) => onChange({ ...value, min: e.target.value })}
      size="small"
      fullWidth
    />
    <TextField
      label="До"
      type="number"
      value={value?.max || ''}
      onChange={(e) => onChange({ ...value, max: e.target.value })}
      size="small"
      fullWidth
    />
  </Box>
);

const DateRangeFilter = ({ value, onChange }: { value: any, onChange: (value: any) => void }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
      <DatePicker
        label="От"
        value={value?.min || null}
        onChange={(date) => onChange({ ...value, min: date?.toISOString() })}
        slotProps={{ textField: { size: 'small', fullWidth: true } }}
      />
      <DatePicker
        label="До"
        value={value?.max || null}
        onChange={(date) => onChange({ ...value, max: date?.toISOString() })}
        slotProps={{ textField: { size: 'small', fullWidth: true } }}
      />
    </Box>
  </LocalizationProvider>
);

type FilterValue = string | number | FilterCondition | null;

interface DataItem {
  id?: string;
  [key: string]: any;
}

interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

interface PaginationOptions {
  page: number;
  pageSize: number;
}

// Обновляем типы для фильтрации
type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'between';

interface FilterCondition {
  operator: FilterOperator;
  value: any;
  value2?: any; // Для оператора between
}

interface FilterOptions {
  [key: string]: FilterValue;
}

interface TableColumn {
  field: string;
  headerName: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'number' | 'select' | 'date' | 'range' | 'operator';
  filterOptions?: { value: string; label: string }[];
  renderCell?: (value: any, row: DataItem) => React.ReactNode;
  supportedOperators?: FilterOperator[];
}

interface TablePageProps<T extends DataItem> {
  title: string;
  columns: TableColumn[];
  fetchData: (
    pagination: { page: number; pageSize: number },
    sort: { field: string; direction: 'asc' | 'desc' } | null,
    filters: Record<string, string>
  ) => Promise<{ data: T[]; totalCount: number }>;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => Promise<void>;
  initialPageSize?: number;
  customFilterComponents?: {
    [field: string]: React.ComponentType<{
      value: FilterValue;
      onChange: (value: FilterValue) => void;
    }>;
  };
}

// Добавляем новый компонент для операторов
const OperatorFilter = ({ 
  value, 
  onChange,
  supportedOperators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains']
}: {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  supportedOperators?: FilterOperator[];
}) => {
  const operatorLabels = {
    eq: '=',
    neq: '≠',
    gt: '>',
    gte: '≥',
    lt: '<',
    lte: '≤',
    contains: 'содержит',
    in: 'в списке',
    between: 'между'
  };

  const [operator, setOperator] = useState<FilterOperator>('eq');
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  useEffect(() => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      setOperator((value as FilterCondition).operator);
      setInputValue((value as FilterCondition).value);
      setInputValue2((value as FilterCondition).value2 || '');
    } else if (value) {
      setOperator('eq');
      setInputValue(value as string);
    }
  }, [value]);

  const handleApply = () => {
    if (operator === 'between') {
      onChange({
        operator,
        value: inputValue,
        value2: inputValue2
      });
    } else {
      onChange({
        operator,
        value: inputValue
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', minWidth: 250 }}>
      <TextField
        select
        fullWidth
        size="small"
        value={operator}
        onChange={(e) => setOperator(e.target.value as FilterOperator)}
        label="Оператор"
      >
        {supportedOperators.map((op) => (
          <MenuItem key={op} value={op}>
            {operatorLabels[op]}
          </MenuItem>
        ))}
      </TextField>

      {operator !== 'in' && operator !== 'between' && (
        <TextField
          fullWidth
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          label="Значение"
        />
      )}

      {operator === 'between' && (
        <>
          <TextField
            fullWidth
            size="small"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            label="От"
          />
          <TextField
            fullWidth
            size="small"
            value={inputValue2}
            onChange={(e) => setInputValue2(e.target.value)}
            label="До"
          />
        </>
      )}

      {operator === 'in' && (
        <TextField
          fullWidth
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          label="Значения (через запятую)"
          helperText="Например: 1,2,3"
        />
      )}

      <Button variant="contained" onClick={handleApply} size="small">
        Применить
      </Button>
    </Box>
  );
};

const AdvancedTablePage = <T extends DataItem>({
  title,
  columns,
  fetchData,
  onAdd,
  onEdit,
  onDelete,
  initialPageSize = 10,
  customFilterComponents,
}: TablePageProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 0,
    pageSize: initialPageSize,
  });
  const [sort, setSort] = useState<SortOptions | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<{
    [key: string]: HTMLElement | null;
  }>({});

  const renderFilterContent = (column: TableColumn) => {
    if (customFilterComponents && customFilterComponents[column.field]) {
      const CustomFilter = customFilterComponents[column.field];
      return (
        <CustomFilter 
          value={filters[column.field]} 
          onChange={(value) => handleFilterChange(column.field, value)}
        />
      );
    }

    switch (column.filterType) {
      case 'operator':
        return (
          <OperatorFilter
            value={filters[column.field]}
            onChange={(value) => handleFilterChange(column.field, value)}
            supportedOperators={column.supportedOperators}
          />
        );
      case 'select':
        return (
          <TextField
            select
            fullWidth
            size="small"
            value={filters[column.field] || ''}
            onChange={(e) => handleFilterChange(column.field, e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">Все</option>
            {column.filterOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        );
      case 'range':
        return (
          <RangeFilter
            value={filters[column.field] || {}}
            onChange={(value) => handleFilterChange(column.field, value)}
          />
        );
      case 'date':
        return (
          <DateRangeFilter
            value={filters[column.field] || {}}
            onChange={(value) => handleFilterChange(column.field, value)}
          />
        );
      default:
        return (
          <TextField
            fullWidth
            size="small"
            type={column.filterType === 'number' ? 'number' : 'text'}
            value={filters[column.field] || ''}
            onChange={(e) => handleFilterChange(column.field, e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {filters[column.field] && (
                    <IconButton
                      size="small"
                      onClick={() => handleFilterReset(column.field)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        );
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Преобразуем фильтры в формат для API
      const apiFilters: Record<string, string> = {};
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value === null || value === '') return;
        
        if (typeof value === 'object' && !Array.isArray(value)) {
          // Обработка FilterCondition
          const condition = value as FilterCondition;
          switch (condition.operator) {
            case 'between':
              apiFilters[`${key}`] = `gte:${condition.value}`;
              apiFilters[`${key}`] = `lte:${condition.value2}`;
              break;
            case 'in':
              apiFilters[`${key}`] = `in:${condition.value}`;
              break;
            default:
              apiFilters[`${key}`] = `${condition.operator}:${condition.value}`;
          }
        } else {
          // Простое значение (по умолчанию eq)
          apiFilters[key] = String(value);
        }
      });
  
      const result = await fetchData(pagination, sort, apiFilters);
      setData(result.data);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination, sort, filters]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
  };

  const handleSort = (field: string) => {
    const isAsc = sort?.field === field && sort.direction === 'asc';
    setSort({
      field,
      direction: isAsc ? 'desc' : 'asc',
    });
  };

  const handleFilterChange = (field: string, value: FilterValue) => {
    setFilters({
      ...filters,
      [field]: value,
    });
    setPagination({ ...pagination, page: 0 });
  };

  const handleFilterReset = (field: string) => {
    const newFilters = { ...filters };
    delete newFilters[field];
    setFilters(newFilters);
  };

  const handleFilterClick = (field: string, event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl({
      ...filterAnchorEl,
      [field]: event.currentTarget,
    });
  };

  const handleFilterClose = (field: string) => {
    setFilterAnchorEl({
      ...filterAnchorEl,
      [field]: null,
    });
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete !== null && onDelete) {
      await onDelete(itemToDelete);
      loadData();
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const isFilterActive = (field: string) => {
    return filters[field] !== undefined && filters[field] !== '' && filters[field] !== null;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{ mr: 1 }}
            >
              Добавить
            </Button>
          )}
          <Tooltip title="Обновить">
            <IconButton onClick={loadData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    width={column.width}
                    sortDirection={
                      sort?.field === column.field ? sort.direction : false
                    }
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {column.sortable ? (
                        <TableSortLabel
                          active={sort?.field === column.field}
                          direction={
                            sort?.field === column.field ? sort.direction : 'asc'
                          }
                          onClick={() => handleSort(column.field)}
                        >
                          {column.headerName}
                        </TableSortLabel>
                      ) : (
                        column.headerName
                      )}
                      {column.filterable && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleFilterClick(column.field, e)}
                          color={isFilterActive(column.field) ? 'primary' : 'default'}
                        >
                          <FilterListIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Popover
                      open={Boolean(filterAnchorEl[column.field])}
                      anchorEl={filterAnchorEl[column.field]}
                      onClose={() => handleFilterClose(column.field)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    >
                      <Box sx={{ p: 2, minWidth: 200 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Фильтр по {column.headerName}
                        </Typography>
                        {renderFilterContent(column)}
                      </Box>
                    </Popover>
                  </TableCell>
                ))}
                {(onEdit || onDelete) && <TableCell align="right">Действия</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    Нет данных
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow hover key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={`${row.id}-${column.field}`}>
                        {column.renderCell
                          ? column.renderCell(row[column.field], row)
                          : row[column.field]}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell align="right">
                        {onEdit && (
                          <IconButton
                            onClick={() => onEdit(row)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton
                            onClick={() => handleDeleteClick(row.id ?? '')}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={pagination.pageSize}
          page={pagination.page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
        />
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить эту запись?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedTablePage;