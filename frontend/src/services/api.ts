import axios from 'axios';
import { AuthResponse, Transaction, TransactionStats, User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', { email, password, name });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/login', { email, password });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },
};

export const transactions = {
  create: async (transaction: Omit<Transaction, '_id' | 'user'>): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', transaction);
    return response.data;
  },

  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions');
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  update: async (id: string, transaction: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.patch<Transaction>(`/transactions/${id}`, transaction);
    return response.data;
  },

  delete: async (id: string): Promise<Transaction> => {
    const response = await api.delete<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  getStats: async (): Promise<TransactionStats> => {
    const response = await api.get<TransactionStats>('/transactions/stats');
    return response.data;
  },
}; 