// UserTable.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
// import { User, Pagination, Sort, Filter } from './types';
// import { fetchUsers, createUser, updateUser, deleteUser } from './api';
import IncomeDialog from './IncomeDialog';
import { IncomeRequestDto, IncomeResponseDto, IncomesApi, Configuration } from '../../api';

const config = new Configuration({ basePath: "https://localhost:7230" });

let client = new IncomesApi(config);
  
  export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
  }
  
  export interface Sort {
    field: keyof IncomeResponseDto;
    order: 'asc' | 'desc';
  }
  
  export interface Filter {
    search: string;
    role: string;
  }
  
  export interface ApiResponse<T> {
    data: T[];
    pagination: Pagination;
  }

const IncomeTable: React.FC = () => {
  // Состояния
  const [incomes, setIncomes] = useState<IncomeResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    pageSize: 10,
    total: 0
  });
  const [sort, setSort] = useState<Sort>({
    field: 'id',
    order: 'asc'
  });
  const [filter, setFilter] = useState<Filter>({
    search: '',
    role: ''
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentIncome, setCurrentIncome] = useState<IncomeResponseDto | null>(null);

  // Загрузка данных
  const loadIncomes = async () => {
    setLoading(true);
    try {
      const response = await client.apiIncomesGet(pagination.page, pagination.pageSize, filter.role, filter.search, sort.field, sort.order === 'desc');
      setIncomes(response.data.data?.data ?? []);
      setPagination(prev => ({
        ...prev,
        total: response.data.data?.totalPages ?? 0
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncomes();
  }, [pagination.page, pagination.pageSize, sort, filter]);

  // Обработчики
  const handleSort = (field: keyof IncomeResponseDto) => {
    const isAsc = sort.field === field && sort.order === 'asc';
    setSort({
      field,
      order: isAsc ? 'desc' : 'asc'
    });
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination(prev => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, search: event.target.value }));
  };

  const handleRoleFilterChange = (event: any) => {
    setFilter(prev => ({ ...prev, role: event.target.value as string }));
  };

  const handleOpenCreateDialog = () => {
    setCurrentIncome(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (income: IncomeResponseDto) => {
    setCurrentIncome(income);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentIncome(null);
  };

  const handleSubmit = async (incomeData: Omit<IncomeRequestDto, 'id'>) => {
    try {
      if (currentIncome) {
        await client.apiIncomesIdPut(currentIncome.id ?? '', incomeData);
      } else {
        await client.apiIncomesPost(incomeData);
      }
      loadIncomes();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await client.apiIncomesIdDelete(id);
      loadIncomes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Income Management
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}

      {/* Фильтры */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={filter.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />
            }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={filter.role}
              label="Role"
              onChange={handleRoleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="guest">Guest</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreateDialog}
            sx={{ ml: 'auto' }}
          >
            Add Income
          </Button>
        </Box>
      </Paper>

      {/* Таблица */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sort.field === 'id'}
                    direction={sort.field === 'id' ? sort.order : 'asc'}
                    onClick={() => handleSort('id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sort.field === 'title'}
                    direction={sort.field === 'title' ? sort.order : 'asc'}
                    onClick={() => handleSort('title')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sort.field === 'date'}
                    direction={sort.field === 'date' ? sort.order : 'asc'}
                    onClick={() => handleSort('date')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sort.field === 'value'}
                    direction={sort.field === 'value' ? sort.order : 'asc'}
                    onClick={() => handleSort('value')}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : incomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No incomes found
                  </TableCell>
                </TableRow>
              ) : (
                incomes.map(income => (
                  <TableRow key={income.id}>
                    <TableCell>{income.id}</TableCell>
                    <TableCell>{income.title}</TableCell>
                    <TableCell>{income.date}</TableCell>
                    <TableCell>{income.value}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenEditDialog(income)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(income.id ?? '')}>
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Пагинация */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.pageSize}
          page={pagination.page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {/* Диалог создания/редактирования */}
      <IncomeDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        income={currentIncome}
      />
    </Container>
  );
};

export default IncomeTable;