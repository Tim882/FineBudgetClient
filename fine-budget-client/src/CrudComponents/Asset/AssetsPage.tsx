import React, { useState } from 'react';
import AdvancedTablePage from '../Base/AdvancedTablePage';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { AssetsApi, Configuration, AssetResponseDto, AssetType } from '../../api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SelectChangeEvent } from '@mui/material';

const config = new Configuration({ basePath: "https://localhost:7230" });
const client = new AssetsApi(config);

const AssetTypeNames = {
  [AssetType.NUMBER_0]: 'Наличные',
  [AssetType.NUMBER_1]: 'Банковский счет',
  [AssetType.NUMBER_2]: 'Кредитная карта',
  [AssetType.NUMBER_3]: 'Инвестиции',
};

const assetTypeOptions = Object.entries(AssetTypeNames).map(([value, label]) => ({
  value: value,
  label: label
}));

interface FormData {
  title: string;
  value: number;
  assetType: AssetType; // Оставляем как числовой enum
  date: Date;
}

const AssetsPage = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<AssetResponseDto | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    value: 0,
    assetType: AssetType.NUMBER_0,
    date: new Date()
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
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleEditClick = (asset: AssetResponseDto) => {
    setCurrentAsset(asset);
    setFormData({
      title: asset.title ?? '',
      value: asset.value ?? 0,
      assetType: typeof asset.assetType === 'number' 
        ? asset.assetType 
        : AssetType.NUMBER_0,
      date: asset.date ? new Date(asset.date) : new Date()
    });
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentAsset(null);
    setFormData({
      title: '',
      value: 0,
      assetType: AssetType.NUMBER_0,
      date: new Date()
    });
    setEditDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      assetType: Number(e.target.value) as AssetType // Преобразуем обратно в число
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        creationDate: date
      }));
    }
  };

  const handleSave = async () => {
    try {
      if (currentAsset) {
        // Update existing asset
        await client.apiAssetsIdPut(currentAsset.id ?? '', {
          title: formData.title,
          value: formData.value,
          assetType: formData.assetType,
          date: formData.date.toISOString()
        });
      } else {
        // Create new asset
        await client.apiAssetsPost({
          title: formData.title,
          value: formData.value,
          assetType: formData.assetType,
          date: formData.date.toISOString()
        });
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
        <AdvancedTablePage<AssetResponseDto>
          title="Активы"
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
              headerName: 'Стоимость', 
              sortable: true,
              filterable: true,
              filterType: 'operator',
              supportedOperators: ['eq', 'gt', 'gte', 'lt', 'lte', 'between'],
              renderCell: (value) => `$${value.toFixed(2)}`,
            },
            { 
              field: 'assetType', 
              headerName: 'Тип актива', 
              sortable: true,
              filterable: true,
              filterType: 'select',
              filterOptions: assetTypeOptions,
              renderCell: (value) => AssetTypeNames[value as keyof typeof AssetTypeNames],
            },
            { 
              field: 'date', 
              headerName: 'Дата создания', 
              sortable: true,
              filterable: true,
              filterType: 'date',
              renderCell: (value) => new Date(value).toLocaleDateString(),
            },
          ]}
          fetchData={fetchAssets}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          initialPageSize={10}
        />

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {currentAsset ? 'Редактировать актив' : 'Добавить новый актив'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="title"
              label="Название актива"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="value"
              label="Стоимость"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.value}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="asset-type-label">Тип актива</InputLabel>
              <Select
                labelId="asset-type-label"
                name="assetType"
                value={formData.assetType.toString()} // Число → строка
                label="Тип актива"
                onChange={handleSelectChange}
              >
                {Object.entries(AssetType)
                  .filter(([key]) => isNaN(Number(key))) // Фильтруем reverse mappings
                  .map(([key, value]) => (
                    <MenuItem key={key} value={value.toString()}> {/* Число → строка */}
                      {AssetTypeNames[value as keyof typeof AssetTypeNames]}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            
            <DatePicker
              label="Дата создания"
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

export default AssetsPage;