import React, { useState, useEffect } from 'react';
import { Transaction, TransactionCategory } from './types';
import { DEFAULT_TRANSACTIONS } from './data/defaultTransactions';
import DashboardStats from './components/DashboardStats';
import TransactionList from './components/TransactionList';
import AddTransactionForm from './components/AddTransactionForm';
import { 
  Sparkles, 
  PlusCircle, 
  Wallet, 
  HelpCircle, 
  Check, 
  X, 
  LogOut, 
  User, 
  RefreshCw,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'add_transaction'>('dashboard');

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Starting/Initial Balance State
  const [initialBalance, setInitialBalance] = useState<number>(1000.00);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState('1000.00');

  // Load offline data on mount
  useEffect(() => {
    const storedTransactions = localStorage.getItem('spendwise_transactions');
    const storedBalance = localStorage.getItem('spendwise_initial_balance');

    if (storedTransactions) {
      try {
        setTransactions(JSON.parse(storedTransactions));
      } catch (e) {
        console.error('Failed to parse offline transactions, seeding default ones.', e);
        setTransactions(DEFAULT_TRANSACTIONS);
        localStorage.setItem('spendwise_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
      }
    } else {
      // Seed with mock data on first visit
      setTransactions(DEFAULT_TRANSACTIONS);
      localStorage.setItem('spendwise_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
    }

    if (storedBalance) {
      const parsed = parseFloat(storedBalance);
      if (!isNaN(parsed)) {
        setInitialBalance(parsed);
        setBalanceInput(parsed.toFixed(2));
      }
    } else {
      localStorage.setItem('spendwise_initial_balance', '1000.00');
    }
  }, []);

  // Save to LocalStorage helper
  const saveTransactionsToOffline = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('spendwise_transactions', JSON.stringify(newTransactions));
  };

  // Add Transaction
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: Date.now().toString() // Simple unique offline ID
    };
    const updated = [newTx, ...transactions];
    saveTransactionsToOffline(updated);
    setCurrentScreen('dashboard');
  };

  // Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    const filtered = transactions.filter(t => t.id !== id);
    saveTransactionsToOffline(filtered);
  };

  // Clear All Data
  const handleClearAllTransactions = () => {
    saveTransactionsToOffline([]);
  };

  // Save modified Initial Balance
  const handleSaveBalance = () => {
    const parsed = parseFloat(balanceInput);
    if (!isNaN(parsed) && parsed >= 0) {
      setInitialBalance(parsed);
      localStorage.setItem('spendwise_initial_balance', parsed.toString());
      setIsEditingBalance(false);
    } else {
      alert('Please enter a valid balance amount (greater than or equal to 0)');
    }
  };

  // Seed back original starter data (Reset system)
  const handleResetToDemo = () => {
    if (window.confirm('Would you like to reset the app to the initial demonstration transactions?')) {
      saveTransactionsToOffline(DEFAULT_TRANSACTIONS);
      setInitialBalance(1000.00);
      setBalanceInput('1000.00');
      localStorage.setItem('spendwise_initial_balance', '1000.00');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900" id="spendwise-app">
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 self-start sm:self-auto cursor-pointer" onClick={() => setCurrentScreen('dashboard')} id="logo-block">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/20">
              <Wallet className="h-5.5 w-5.5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold font-display tracking-tight text-slate-900">SpendWise</span>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-100/50 uppercase">Offline</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Personal Finance Manager</p>
            </div>
          </div>

          {/* User Context & Starting Balance settings */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs" id="header-controls">
            {/* Initial balance manager */}
            <div className="flex items-center bg-slate-100/80 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200/50 transition-colors">
              <span className="text-slate-500 font-medium mr-1.5">Starting Cash:</span>
              {isEditingBalance ? (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-700">$</span>
                  <input
                    id="input-starting-balance"
                    type="number"
                    value={balanceInput}
                    onChange={(e) => setBalanceInput(e.target.value)}
                    className="w-16 bg-white border border-slate-300 rounded px-1 text-center font-bold font-mono text-slate-800 focus:outline-hidden"
                  />
                  <button 
                    id="btn-save-starting-balance"
                    onClick={handleSaveBalance} 
                    className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button 
                    id="btn-cancel-starting-balance"
                    onClick={() => {
                      setIsEditingBalance(false);
                      setBalanceInput(initialBalance.toFixed(2));
                    }} 
                    className="p-1 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-bold font-mono text-slate-800">${initialBalance.toFixed(2)}</span>
                  <button 
                    id="btn-edit-starting-balance"
                    onClick={() => setIsEditingBalance(true)} 
                    className="p-0.5 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Change Starting Balance"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Email Welcome Tag */}
            <div className="hidden md:flex items-center gap-2 bg-blue-50/50 text-blue-800 py-1.5 px-3 rounded-xl border border-blue-100/30">
              <User className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-semibold truncate max-w-[150px]">saberabotaleb777@gmail.com</span>
            </div>

            {/* Reset to Demo button */}
            <button
              id="btn-restore-demo"
              onClick={handleResetToDemo}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200/60 rounded-xl transition-all"
              title="Reset data back to high-quality template transactions"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        <AnimatePresence mode="wait">
          {currentScreen === 'dashboard' ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
              id="dashboard-screen-wrapper"
            >
              {/* Dashboard Banner & Floating Action */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs">
                <div>
                  <h1 className="text-2xl font-black font-display text-slate-900 tracking-tight flex items-center gap-2">
                    Welcome back, Saber!
                    <Sparkles className="h-5 w-5 text-amber-500 fill-amber-400 animate-pulse" />
                  </h1>
                  <p className="text-slate-500 text-xs mt-1">
                    Your offline wallet data is saved in your local storage. Safe from network outages.
                  </p>
                </div>
                <button
                  id="btn-add-floating"
                  onClick={() => setCurrentScreen('add_transaction')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  Log New Transaction
                </button>
              </div>

              {/* Statistics & Analytics Block */}
              <DashboardStats 
                transactions={transactions} 
                initialBalance={initialBalance} 
              />

              {/* Transaction Listing & Search Panel */}
              <TransactionList 
                transactions={transactions} 
                onDeleteTransaction={handleDeleteTransaction}
                onClearAllTransactions={handleClearAllTransactions}
                onNavigateToAddTransaction={() => setCurrentScreen('add_transaction')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="add-tx-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              id="add-transaction-screen-wrapper"
            >
              <AddTransactionForm 
                onSave={handleAddTransaction} 
                onCancel={() => setCurrentScreen('dashboard')} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer copyright info */}
      <footer className="mt-auto py-6 text-center text-xs text-slate-400 border-t border-slate-200/50 bg-white" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 SpendWise Offline Personal Finance. All rights saved in local storage.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-help flex items-center gap-1">
              <Wallet className="h-3 w-3 text-blue-500" />
              Fully Client-Side Data
            </span>
            <span className="border-l border-slate-200 pl-4 text-emerald-600 font-semibold">
              ● Secure Storage
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
