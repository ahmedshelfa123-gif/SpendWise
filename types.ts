export type TransactionCategory = 'Shopping' | 'Food' | 'Transport' | 'Utilities' | 'Health' | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  merchant?: string;
  date: string; // YYYY-MM-DD
  category: TransactionCategory;
  notes?: string;
}

export interface UserSettings {
  initialBalance: number;
}
