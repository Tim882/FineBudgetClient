import React, { useState } from 'react';
import AdvancedTablePage from '../Base/AdvancedTablePage';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { AssetsApi, Configuration, AssetResponseDto } from '../../api';

const config = new Configuration({ basePath: "https://localhost:7230" });
const client = new AssetsApi(config);

interface Asset {
  id: string;
  title: string;
  balance: number;
}

const AssetsPage = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<AssetResponseDto | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    balance: 0
  });

  const fetchAssets = async (
    pagination: { page: number; pageSize: number },
    sort: { field: string; direction: 'asc' | 'desc' } | null,
    filters: Record<string, string>
  ): Promise<{ data: AssetResponseDto[]; totalCount: number }> => {
    try {
      const response = await client.apiAssetsGet(
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
      await client.apiAssetsIdDelete(id);
      //return true;
    } catch (error) {
      console.error('Delete error:', error);
      //return false;
    }
  };

  const handleEditClick = (asset: AssetResponseDto) => {
    setCurrentAsset(asset);
    setFormData({
      title: asset.title ?? '',
      balance: asset.value ?? 0
    });
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentAsset(null);
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
      if (currentAsset) {
        // Update existing asset
        await client.apiAssetsIdPut(currentAsset.id ?? '', {
          title: formData.title,
          value: formData.balance
        });
      } else {
        // Create new asset
        await client.apiAssetsPost({
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
      <AdvancedTablePage<AssetResponseDto>
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
        fetchData={fetchAssets}
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        initialPageSize={10}
      />

      {/* Редактирование/добавление в диалоговом окне */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentAsset ? 'Редактировать счет' : 'Добавить новый счет'}
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

export default AssetsPage;