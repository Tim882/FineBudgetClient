import api from './api';
import { BudgetSummary, Transaction } from '../types/budget';

export const getFamilyBudget = async (): Promise<{
  summary: BudgetSummary;
  recentTransactions: Transaction[];
}> => {
  const response = await api.get('/budget');
  return response.data;
};

export const addTransaction = async (
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> => {
  const response = await api.post('/transactions', transaction);
  return response.data;
};