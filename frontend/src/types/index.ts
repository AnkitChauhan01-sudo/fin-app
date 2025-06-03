export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  user: string;
}

export interface TransactionStats {
  income: {
    total: number;
    count: number;
  };
  expense: {
    total: number;
    count: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
} 