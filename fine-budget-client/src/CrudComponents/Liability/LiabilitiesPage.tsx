import React, { useState } from 'react';
import AdvancedTablePage from '../Base/AdvancedTablePage';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { LiabilitiesApi, Configuration, LiabilityResponseDto, LiabilityType } from '../../api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SelectChangeEvent } from '@mui/material';

const config = new Configuration({ basePath: "https://localhost:7230" });
const client = new LiabilitiesApi(config);

const LiabilityTypeNames = {
  [LiabilityType.NUMBER_0]: 'Кредит',
  [LiabilityType.NUMBER_1]: 'Ипотека'
};

const liabilityTypeOptions = Object.entries(LiabilityTypeNames).map(([value, label]) => ({
  value: value,
  label: label
}));

interface FormData {
  title: string;
  value: number;
  liabilityType: LiabilityType; // Оставляем как числовой enum
  date: Date;
}

const LiabilitiesPage = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentLiability, setCurrentLiability] = useState<LiabilityResponseDto | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    value: 0,
    liabilityType: LiabilityType.NUMBER_0,
    date: new Date()
  });

  const fetchLiabilities = async (
    pagination: { page: number; pageSize: number },
    sort: { field: string; direction: 'asc' | 'desc' } | null,
    filters: Record<string, string>
  ): Promise<{ data: LiabilityResponseDto[]; totalCount: number }> => {
    try {
      const response = await client.apiLiabilitiesGet(
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
      await client.apiLiabilitiesIdDelete(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleEditClick = (liability: LiabilityResponseDto) => {
    setCurrentLiability(liability);
    setFormData({
      title: liability.title ?? '',
      value: liability.value ?? 0,
      liabilityType: typeof liability.liabilityType === 'number' 
        ? liability.liabilityType 
        : LiabilityType.NUMBER_0,
      date: liability.date ? new Date(liability.date) : new Date()
    });
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentLiability(null);
    setFormData({
      title: '',
      value: 0,
      liabilityType: LiabilityType.NUMBER_0,
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
      liabilityType: Number(e.target.value) as LiabilityType // Преобразуем обратно в число
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
      if (currentLiability) {
        // Update existing liability
        await client.apiLiabilitiesIdPut(currentLiability.id ?? '', {
          title: formData.title,
          value: formData.value,
          liabilityType: formData.liabilityType,
          date: formData.date.toISOString()
        });
      } else {
        // Create new liability
        await client.apiLiabilitiesPost({
          title: formData.title,
          value: formData.value,
          liabilityType: formData.liabilityType,
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
        <AdvancedTablePage<LiabilityResponseDto>
          title="Пассивы"
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
              field: 'liabilityType', 
              headerName: 'Тип пассива', 
              sortable: true,
              filterable: true,
              filterType: 'select',
              filterOptions: liabilityTypeOptions,
              renderCell: (value) => LiabilityTypeNames[value as keyof typeof LiabilityTypeNames],
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
          fetchData={fetchLiabilities}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          initialPageSize={10}
        />

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {currentLiability ? 'Редактировать пассив' : 'Добавить новый пассив'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="title"
              label="Название пассива"
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
              <InputLabel id="liability-type-label">Тип пассива</InputLabel>
              <Select
                labelId="liability-type-label"
                name="liabilityType"
                value={formData.liabilityType.toString()} // Число → строка
                label="Тип пассива"
                onChange={handleSelectChange}
              >
                {Object.entries(LiabilityType)
                  .filter(([key]) => isNaN(Number(key))) // Фильтруем reverse mappings
                  .map(([key, value]) => (
                    <MenuItem key={key} value={value.toString()}> {/* Число → строка */}
                      {LiabilityTypeNames[value as keyof typeof LiabilityTypeNames]}
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

export default LiabilitiesPage;