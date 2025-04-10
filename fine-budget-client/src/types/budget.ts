export interface Transaction {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    type: 'income' | 'expense';
  }
  
export interface BudgetSummary {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    startDate: string;
    endDate: string;
}