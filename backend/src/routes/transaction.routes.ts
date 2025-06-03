import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} from '../controllers/transaction.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

router.use(auth); // Protect all transaction routes

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/stats', getTransactionStats);
router.get('/:id', getTransactionById);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export const transactionRoutes = router; 