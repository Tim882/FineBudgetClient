import React, { useState } from 'react';
import AdvancedTablePage from '../Base/AdvancedTablePage';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { IncomesApi, Configuration, IncomeResponseDto } from '../../api';

const config = new Configuration({ basePath: "https://localhost:7230" });
const client = new IncomesApi(config);

interface Income {
  id: string;
  title: string;
  balance: number;
}

const IncomesPage = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<IncomeResponseDto | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    balance: 0
  });

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
        data: response.data.data?.data ?? [],
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
      //return true;
    } catch (error) {
      console.error('Delete error:', error);
      //return false;
    }
  };

  const handleEditClick = (income: IncomeResponseDto) => {
    setCurrentIncome(income);
    setFormData({
      title: income.title ?? '',
      balance: income.value ?? 0
    });
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentIncome(null);
    setFormData({
      title: '',
      balance: 0
    });
    setEditDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    try {
      if (currentIncome) {
        // Update existing income
        await client.apiIncomesIdPut(currentIncome.id ?? '', {
          title: formData.title,
          value: formData.balance
        });
      } else {
        // Create new income
        await client.apiIncomesPost({
          title: formData.title,
          value: formData.balance
        });
      }
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' // Центрируем содержимое по горизонтали
    }}>
      <AdvancedTablePage<IncomeResponseDto>
        title="Счета"
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
            field: 'balance', 
            headerName: 'Баланс', 
            sortable: true,
            filterable: true,
            filterType: 'operator',
            supportedOperators: ['eq', 'gt', 'gte', 'lt', 'lte', 'between'],
            renderCell: (value) => `$${value.toFixed(2)}`,
          },
        ]}
        fetchData={fetchIncomes}
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        initialPageSize={10}
      />

      {/* Редактирование/добавление в диалоговом окне */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentIncome ? 'Редактировать счет' : 'Добавить новый счет'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Название счета"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="balance"
            label="Баланс"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.balance}
            onChange={handleFormChange}
          />
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
  );
};

export default IncomesPage;