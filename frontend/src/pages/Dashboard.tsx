import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { transactions } from '../services/api';
import { Transaction, TransactionStats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, transactionsData] = await Promise.all([
          transactions.getStats(),
          transactions.getAll(),
        ]);
        setStats(statsData);
        setRecentTransactions(transactionsData.slice(0, 5));
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const chartData = [
    {
      name: 'Income',
      amount: stats?.income.total || 0,
    },
    {
      name: 'Expenses',
      amount: stats?.expense.total || 0,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Financial Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Income vs Expenses
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Box>
              <Typography variant="body1">
                Total Income: ${stats?.income.total.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Total Expenses: ${stats?.expense.total.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Balance: ${((stats?.income.total || 0) - (stats?.expense.total || 0)).toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Number of Transactions: {(stats?.income.count || 0) + (stats?.expense.count || 0)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: 'span 12' }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            {recentTransactions.map((transaction) => (
              <Box
                key={transaction._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                  borderBottom: '1px solid #eee',
                }}
              >
                <Box>
                  <Typography variant="body1">{transaction.description}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.category}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                >
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 