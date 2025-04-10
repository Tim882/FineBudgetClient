import React, { useEffect, useState } from 'react';
import AdvancedTablePage from '../Base/AdvancedTablePage';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { IncomesApi, Configuration, IncomeResponseDto, AccountResponseDto, AccountsApi } from '../../api';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const config = new Configuration({ basePath: "https://localhost:7230" });
const client = new IncomesApi(config);
const accountsClient = new AccountsApi(config);

interface FormData {
  title: string;
  value: number;
  description: string;
  category: number;
  date: Date;
  accountId: string;
}

const categoryOptions = [
  { value: '0', label: 'Зарплата' }
];

const IncomesPage = () => {
  const [accounts, setAccounts] = useState<AccountResponseDto[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<IncomeResponseDto | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    value: 0,
    description: '',
    category: 1,
    date: new Date(),
    accountId: ''
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountsClient.apiAccountsGet(1, 100);
        setAccounts(response.data.data?.items ?? []);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const fetchIncomes = async (
    pagination: { page: number; pageSize: number },
    sort: { field: string; direction: 'asc' | 'desc' } | null,
    filters: Record<string, string>
  ): Promise<{ data: IncomeResponseDto[]; totalCount: number }> => {
    try {
      const response = await client.apiIncomesGet(
        pagination.page + 1,
        pagination.pageSize,
        sort?.field,
        sort?.direction === 'asc',
        filters
      );
      return {
        data: response.data.data?.items ?? [],
        totalCount: response.data.data?.totalCount ?? 0
      };
    } catch (error) {
      console.error('Fetch error:', error);
      return { data: [], totalCount: 0 };
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await client.apiIncomesIdDelete(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleEditClick = (income: IncomeResponseDto) => {
    setCurrentIncome(income);
    setFormData({
      title: income.title ?? '',
      value: income.value ?? 0,
      description: income.description ?? '',
      category: income.incomeCategory ?? 1,
      date: income.date ? new Date(income.date) : new Date(),
      accountId: income.accountId ?? accounts[0]?.id ?? '',
    });
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentIncome(null);
    setFormData({
      title: '',
      value: 0,
      description: '',
      category: 1,
      date: new Date(),
      accountId: accounts[0]?.id ?? '',
    });
    setEditDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };

  const handleSave = async () => {
    try {
      const incomeData = {
        title: formData.title,
        value: formData.value,
        description: formData.description,
        category: formData.category,
        date: formData.date.toISOString(),
        accountId: formData.accountId
      };

      if (currentIncome) {
        await client.apiIncomesIdPut(currentIncome.id ?? '', incomeData);
      } else {
        await client.apiIncomesPost(incomeData);
      }
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <AdvancedTablePage<IncomeResponseDto>
          title="Расходы"
          columns={[
            { 
              field: 'id', 
              headerName: 'ID', 
              width: 80, 
              sortable: true,
              filterable: true,
              filterType: 'operator',
              supportedOperators: ['eq', 'contains'],
            },
            { 
              field: 'title', 
              headerName: 'Название', 
              sortable: true, 
              filterable: true,
              filterType: 'operator',
              supportedOperators: ['eq', 'contains'],
            },
            { 
              field: 'value', 
              headerName: 'Сумма', 
              sortable: true,
              filterable: true,
              filterType: 'operator',
              supportedOperators: ['eq', 'gt', 'gte', 'lt', 'lte', 'between'],
              renderCell: (value) => `$${value.toFixed(2)}`,
            },
            { 
              field: 'incomeCategory', 
              headerName: 'Категория', 
              sortable: true,
              filterable: true,
              filterType: 'select',
              filterOptions: categoryOptions,
              renderCell: (value) => categoryOptions.find(c => c.value === String(value))?.label || value,
            },
            { 
              field: 'date', 
              headerName: 'Дата', 
              sortable: true,
              filterable: true,
              filterType: 'date',
              renderCell: (value) => new Date(value).toLocaleDateString(),
            },
            { 
              field: 'accountId', 
              headerName: 'Счет', 
              sortable: true,
              filterable: true,
              renderCell: (value) => {
                const account = accounts.find(a => a.id === value);
                return account ? account.title : 'Не указан';
              },
            },
          ]}
          fetchData={fetchIncomes}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          initialPageSize={10}
        />

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {currentIncome ? 'Редактировать расход' : 'Добавить новый расход'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="title"
              label="Название"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="value"
              label="Сумма"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.value}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Описание"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="category-label">Категория</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                label="Категория"
                onChange={handleSelectChange}
              >
                {categoryOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DatePicker
              label="Дата"
              value={formData.date}
              onChange={handleDateChange}
              slotProps={{
                  textField: {
                  fullWidth: true,
                  margin: 'dense',
                  variant: 'outlined',
                }
              }}
            />
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel id="account-label">Счет</InputLabel>
              <Select
                labelId="account-label"
                name="accountId"
                value={formData.accountId}
                label="Счет"
                onChange={handleSelectChange}
              >
                {accounts.map(account => (
                  <MenuItem key={account.id} value={account.id ?? ''}>
                    {account.title} (${account.balance?.toFixed(2)})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="secondary">
              Отмена
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default IncomesPage;