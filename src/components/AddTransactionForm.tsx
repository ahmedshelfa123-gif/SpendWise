import React, { useState } from 'react';
import { TransactionCategory, Transaction } from '../types';
import { categoryConfig } from './DashboardStats';
import { 
  ArrowLeft, 
  DollarSign, 
  User, 
  Calendar, 
  FileText, 
  Check, 
  AlertCircle,
  PlusCircle
} from 'lucide-react';

interface AddTransactionFormProps {
  onSave: (transactionData: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

export default function AddTransactionForm({ onSave, onCancel }: AddTransactionFormProps) {
  // Get today's date formatted as YYYY-MM-DD
  const getTodayString = () => {
    // Standard default date based on metadata: 2026-06-24
    return '2026-06-24';
  };

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayString());
  const [category, setCategory] = useState<TransactionCategory>('Shopping');
  const [notes, setNotes] = useState<string>('');
  
  // Validation error state
  const [error, setError] = useState<string | null>(null);

  // Strictly filter and format the amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    let val = e.target.value;
    
    // Remove any character that is not a digit or decimal dot
    let cleaned = val.replace(/[^0-9.]/g, '');
    
    // Allow only one decimal point
    const split = cleaned.split('.');
    if (split.length > 2) {
      cleaned = split[0] + '.' + split.slice(1).join('');
    }
    
    // Limit decimal precision to 2 digits for financial accuracy
    if (split[1] !== undefined && split[1].length > 2) {
      cleaned = `${split[0]}.${split[1].substring(0, 2)}`;
    }
    
    setAmount(cleaned);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    
    // Validation
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than $0.00');
      return;
    }

    if (!date) {
      setError('Please pick a valid date');
      return;
    }

    // Save
    onSave({
      amount: parsedAmount,
      type,
      merchant: merchant.trim() || undefined,
      date,
      category,
      notes: notes.trim() || undefined
    });
  };

  const categories: TransactionCategory[] = ['Shopping', 'Food', 'Transport', 'Utilities', 'Health', 'Other'];

  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden" id="add-transaction-form-card">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 relative">
        <button 
          id="btn-back-header"
          onClick={onCancel}
          type="button"
          className="absolute left-6 top-6 p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center pt-2">
          <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Log Offline Entry</p>
          <h2 className="text-xl font-bold font-display mt-0.5">Add Transaction</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6" id="add-transaction-form">
        {/* Toggle Expense / Income */}
        <div className="flex bg-slate-100 p-1 rounded-2xl" id="type-selector-wrapper">
          <button
            id="btn-type-expense"
            type="button"
            onClick={() => {
              setType('expense');
              setError(null);
            }}
            className={`flex-1 text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${
              type === 'expense' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Expense
          </button>
          <button
            id="btn-type-income"
            type="button"
            onClick={() => {
              setType('income');
              setError(null);
            }}
            className={`flex-1 text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${
              type === 'income' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Income
          </button>
        </div>

        {/* Validation Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-2xl flex items-start gap-2.5 animate-pulse" id="form-error-alert">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Amount Field (Enormous Highlight) */}
        <div className="space-y-1.5">
          <label htmlFor="amount-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Amount <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400">
              <span className="text-2xl font-bold font-display">$</span>
            </div>
            <input
              id="amount-input"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              required
              className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-2xl text-2xl font-bold font-mono focus:outline-hidden transition-all text-slate-900"
              autoComplete="off"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            * Strictly accepts numerical inputs & optional decimal points only.
          </p>
        </div>

        {/* Merchant Field */}
        <div className="space-y-1.5">
          <label htmlFor="merchant-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Merchant Name <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="merchant-input"
              type="text"
              placeholder="e.g. Starbucks, Walmart, landlord"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Date Field */}
        <div className="space-y-1.5">
          <label htmlFor="date-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Transaction Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Category Buttons (Exactly Shopping, Food, Transport, Utilities, Health, Other) */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pick Category <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="category-selector-grid">
            {categories.map((cat) => {
              const isSelected = category === cat;
              const config = categoryConfig[cat];
              const Icon = config.icon;
              
              return (
                <button
                  id={`btn-cat-${cat.toLowerCase()}`}
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center group relative ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-semibold shadow-xs' 
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`p-2 rounded-xl mb-1.5 transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs tracking-wide">{cat}</span>
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white rounded-full p-0.5">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes (Optional) */}
        <div className="space-y-1.5">
          <label htmlFor="notes-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Notes / Memo <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
            <textarea
              id="notes-input"
              rows={2}
              placeholder="e.g. Bought dynamic monitor mount, office utilities"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button
            id="btn-cancel-form"
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            id="btn-submit-form"
            type="submit"
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg shadow-blue-500/10"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
}
