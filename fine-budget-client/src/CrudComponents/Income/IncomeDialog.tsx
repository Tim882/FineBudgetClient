// UserDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { IncomeResponseDto } from '../../api';

interface IncomeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (income: Omit<IncomeResponseDto, 'id'>) => void;
  income: IncomeResponseDto | null;
}

const IncomeDialog: React.FC<IncomeDialogProps> = ({ open, onClose, onSubmit, income }) => {
  const [formData, setFormData] = useState<Omit<IncomeResponseDto, 'id'>>({
    title: '',
    date: '',
    value: 0
  });

  useEffect(() => {
    if (income) {
      setFormData({
        title: income.title,
        date: income.date,
        value: income.value
      });
    } else {
      setFormData({
        title: '',
        date: '',
        value: 0
      });
    }
  }, [income]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: any) => {
    setFormData(prev => ({ ...prev, role: e.target.value as string }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{income ? 'Edit User' : 'Create User'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Date"
            name="date"
            type="string"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Balance"
            name="value"
            type="string"
            value={formData.value}
            onChange={handleChange}
            fullWidth
            required
          />
          {/* <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="guest">Guest</MenuItem>
            </Select>
          </FormControl> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {income ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomeDialog;