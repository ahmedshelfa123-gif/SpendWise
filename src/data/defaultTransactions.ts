import { Transaction } from '../types';

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 120.50,
    type: 'expense',
    merchant: 'Supermarket Express',
    date: '2026-06-20',
    category: 'Food',
    notes: 'Weekly grocery shopping'
  },
  {
    id: '2',
    amount: 45.00,
    type: 'expense',
    merchant: 'Metro Transit Office',
    date: '2026-06-21',
    category: 'Transport',
    notes: 'Monthly transit card refill'
  },
  {
    id: '3',
    amount: 85.00,
    type: 'expense',
    merchant: 'Department Store',
    date: '2026-06-22',
    category: 'Shopping',
    notes: 'Summer t-shirt and shorts'
  },
  {
    id: '4',
    amount: 60.00,
    type: 'expense',
    merchant: 'City Water & Power',
    date: '2026-06-23',
    category: 'Utilities',
    notes: 'Water utility bill adjustment'
  },
  {
    id: '5',
    amount: 35.00,
    type: 'expense',
    merchant: 'Downtown Pharmacy',
    date: '2026-06-24',
    category: 'Health',
    notes: 'Multivitamins and prescription refill'
  },
  {
    id: '6',
    amount: 2500.00,
    type: 'income',
    merchant: 'Tech Corp Inc',
    date: '2026-06-15',
    category: 'Other',
    notes: 'Monthly project base salary'
  },
  {
    id: '7',
    amount: 15.75,
    type: 'expense',
    merchant: 'Starbucks Coffee',
    date: '2026-06-24',
    category: 'Food',
    notes: 'Latte and cinnamon roll'
  }
];
