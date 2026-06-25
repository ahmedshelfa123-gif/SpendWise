import React, { useState } from 'react';
import { Transaction, TransactionCategory } from '../types';
import { categoryConfig } from './DashboardStats';
import { 
  Search, 
  Trash2, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCcw,
  Plus,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onClearAllTransactions: () => void;
  onNavigateToAddTransaction: () => void;
}

export default function TransactionList({ 
  transactions, 
  onDeleteTransaction, 
  onClearAllTransactions,
  onNavigateToAddTransaction
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesType = selectedType === 'All' || t.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort by date (descending), then ID descending for stable key ordering
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateComparison = b.date.localeCompare(a.date);
    if (dateComparison !== 0) return dateComparison;
    return b.id.localeCompare(a.id);
  });

  // Calculate matching stats
  const totalAmountMatching = sortedTransactions.reduce((sum, t) => {
    return t.type === 'expense' ? sum - t.amount : sum + t.amount;
  }, 0);

  const categories: string[] = ['All', 'Shopping', 'Food', 'Transport', 'Utilities', 'Health', 'Other'];

  const formatDate = (dateString: string) => {
    const d = new Date(dateString + 'T00:00:00');
    return d.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6" id="transaction-list-root">
      {/* List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
          <p className="text-xs text-slate-500">View, search, and manage your logged payments</p>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {transactions.length > 0 && (
            <button
              id="btn-clear-all"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your local transactions list? This cannot be undone.')) {
                  onClearAllTransactions();
                }
              }}
              className="text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors font-medium ml-auto sm:ml-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear History
            </button>
          )}
          <button
            id="btn-add-primary"
            onClick={onNavigateToAddTransaction}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3" id="filter-bar">
        {/* Search */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="input-search"
            type="text"
            placeholder="Search merchants, categories, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
          />
        </div>

        {/* Category filter */}
        <div className="relative md:col-span-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            id="select-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Type filter */}
        <div className="relative md:col-span-3">
          <select
            id="select-type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          >
            <option value="All">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Incomes</option>
          </select>
        </div>
      </div>

      {/* Filter status/summary */}
      {(searchTerm || selectedCategory !== 'All' || selectedType !== 'All') && (
        <div className="flex items-center justify-between text-xs bg-blue-50/50 text-blue-700 p-3 rounded-xl border border-blue-100/50">
          <div className="flex items-center gap-1">
            <span>Found <b>{sortedTransactions.length}</b> matches</span>
            {sortedTransactions.length > 0 && (
              <span>• Net in current filter: <b>{totalAmountMatching >= 0 ? '+' : '-'}${Math.abs(totalAmountMatching).toFixed(2)}</b></span>
            )}
          </div>
          <button 
            id="btn-reset-filters"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedType('All');
            }}
            className="font-bold flex items-center gap-1 hover:underline text-blue-800"
          >
            <RefreshCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      )}

      {/* Transactions List */}
      <div className="relative overflow-hidden" id="transactions-scroller">
        {sortedTransactions.length > 0 ? (
          <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {sortedTransactions.map((t) => {
                const config = categoryConfig[t.category] || categoryConfig.Other;
                const Icon = config.icon;
                const isExpense = t.type === 'expense';

                return (
                  <motion.div
                    key={t.id}
                    id={`transaction-row-${t.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="group py-3.5 flex items-center justify-between gap-4 transition-all hover:bg-slate-50/70 px-2 rounded-xl"
                  >
                    {/* Icon & Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2.5 rounded-xl shrink-0 ${config.bg} ${config.text}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-semibold text-sm text-slate-900 truncate">
                            {t.merchant || t.category}
                          </h5>
                          {t.merchant && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.5 rounded-md">
                              {t.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(t.date)}
                          </span>
                          {t.notes && (
                            <span className="truncate max-w-[120px] sm:max-w-[200px] border-l border-slate-200 pl-2">
                              {t.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action & Amount */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className={`font-mono text-sm font-bold flex items-center justify-end ${isExpense ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isExpense ? (
                            <ArrowDownRight className="h-3.5 w-3.5 stroke-[2.5]" />
                          ) : (
                            <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                          )}
                          ${t.amount.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize block">
                          {t.type}
                        </span>
                      </div>
                      <button
                        id={`btn-delete-row-${t.id}`}
                        onClick={() => onDeleteTransaction(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500" id="empty-state">
            <TrendingDown className="h-12 w-12 text-slate-300 mx-auto stroke-1 mb-3" />
            <p className="font-semibold text-sm">No transactions found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[260px] mx-auto">
              {transactions.length === 0 
                ? "Start offline tracking by adding your first transaction!" 
                : "Try adjusting your search criteria or category filters."}
            </p>
            {transactions.length === 0 && (
              <button
                id="btn-add-empty"
                onClick={onNavigateToAddTransaction}
                className="mt-4 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Transaction
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
