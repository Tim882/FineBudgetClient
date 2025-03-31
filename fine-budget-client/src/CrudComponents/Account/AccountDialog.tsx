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
import { AccountResponseDto } from '../../api';

interface AccountDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (account: Omit<AccountResponseDto, 'id'>) => void;
  account: AccountResponseDto | null;
}

const AccountDialog: React.FC<AccountDialogProps> = ({ open, onClose, onSubmit, account }) => {
  const [formData, setFormData] = useState<Omit<AccountResponseDto, 'id'>>({
    title: '',
    date: '',
    balance: 0
  });

  useEffect(() => {
    if (account) {
      setFormData({
        title: account.title,
        date: account.date,
        balance: account.balance
      });
    } else {
      setFormData({
        title: '',
        date: '',
        balance: 0
      });
    }
  }, [account]);

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
      <DialogTitle>{account ? 'Edit User' : 'Create User'}</DialogTitle>
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
            name="balance"
            type="string"
            value={formData.balance}
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
          {account ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountDialog;