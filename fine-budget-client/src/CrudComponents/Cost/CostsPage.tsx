import React, { useState } from 'react';
import AdvancedTablePage from '../Base/AdvancedTablePage';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CostsApi, Configuration, CostResponseDto } from '../../api';

const config = new Configuration({ basePath: "https://localhost:7230" });
const client = new CostsApi(config);

interface Cost {
  id: string;
  title: string;
  balance: number;
}

const CostsPage = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentCost, setCurrentCost] = useState<CostResponseDto | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    balance: 0
  });

  const fetchCosts = async (
    pagination: { page: number; pageSize: number },
    sort: { field: string; direction: 'asc' | 'desc' } | null,
    filters: Record<string, string>
  ): Promise<{ data: CostResponseDto[]; totalCount: number }> => {
    try {
      const response = await client.apiCostsGet(
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
      await client.apiCostsIdDelete(id);
      //return true;
    } catch (error) {
      console.error('Delete error:', error);
      //return false;
    }
  };

  const handleEditClick = (cost: CostResponseDto) => {
    setCurrentCost(cost);
    setFormData({
      title: cost.title ?? '',
      balance: cost.value ?? 0
    });
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentCost(null);
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
      if (currentCost) {
        // Update existing cost
        await client.apiCostsIdPut(currentCost.id ?? '', {
          title: formData.title,
          value: formData.balance
        });
      } else {
        // Create new cost
        await client.apiCostsPost({
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
      <AdvancedTablePage<CostResponseDto>
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
        fetchData={fetchCosts}
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        initialPageSize={10}
      />

      {/* Редактирование/добавление в диалоговом окне */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentCost ? 'Редактировать счет' : 'Добавить новый счет'}
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

export default CostsPage;