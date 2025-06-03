import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { transactions } from '../services/api';
import { Transaction } from '../types';

const categories = [
  'Salary',
  'Freelance',
  'Investments',
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Other',
];

const Transactions: React.FC = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchTransactions = async () => {
    try {
      const data = await transactions.getAll();
      setTransactionList(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description,
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await transactions.update(editingTransaction._id, {
          ...formData,
          amount: parseFloat(formData.amount),
          type: formData.type,
        });
      } else {
        await transactions.create({
          ...formData,
          amount: parseFloat(formData.amount),
          type: formData.type,
        });
      }
      handleCloseDialog();
      fetchTransactions();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save transaction');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactions.delete(id);
        fetchTransactions();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete transaction');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Transaction
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        {transactionList.map((transaction) => (
          <Box
            key={transaction._id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
              borderBottom: '1px solid #eee',
            }}
          >
            <Box>
              <Typography variant="body1">{transaction.description}</Typography>
              <Typography variant="body2" color="text.secondary">
                {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                variant="body1"
                color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                sx={{ mr: 2 }}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </Typography>
              <IconButton onClick={() => handleOpenDialog(transaction)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(transaction._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  select
                  fullWidth
                  label="Type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </TextField>
              </Grid>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTransaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions; 