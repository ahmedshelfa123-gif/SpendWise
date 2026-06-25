import React, { useState, useEffect } from 'react';
import { Transaction } from './types';
import { DEFAULT_TRANSACTIONS } from './data/defaultTransactions';
import DashboardStats from './components/DashboardStats';
import TransactionList from './components/TransactionList';
import AddTransactionForm from './components/AddTransactionForm';
import { 
  Sparkles, 
  PlusCircle, 
  Wallet, 
  Check, 
  X, 
  User, 
  RefreshCw,
  Edit2,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// قاموس الترجمة المدمج (عربي - إنجليزي)
const translations = {
  en: {
    title: "SpendWise",
    subtitle: "Smart Personal Finance Manager",
    startingCash: "Starting Cash:",
    welcomeBack: "Welcome back,",
    welcomeTitle: "Welcome to SpendWise",
    welcomeSubtitle: "Let's personalize your financial assistant. What should we call you?",
    namePlaceholder: "Enter your name...",
    btnGetStarted: "Get Started",
    bannerDesc: "Your offline wallet data is saved in your local storage.",
    btnLogNew: "Log New Transaction",
    footerText: "© 2026 SpendWise Offline Personal Finance.",
    footerInfo1: "Fully Client-Side Data",
    footerInfo2: "● Secure Storage",
    alertBalance: "Please enter a valid balance amount (greater than or equal to 0)",
    confirmReset: "Would you like to reset the app to the initial demonstration transactions?",
    btnChangeName: "Change Name"
  },
  ar: {
    title: "سبيند وايز",
    subtitle: "المساعد المالي الذكي لإدارة أموالك",
    startingCash: "رأس المال البدئي:",
    welcomeBack: "مرحباً بك مجدداً،",
    welcomeTitle: "مرحباً بك في سبيند وايز",
    welcomeSubtitle: "دعنا نخصص حسابك المالي، ما الاسم المفضل الذي تود أن نناديك به؟",
    namePlaceholder: "أدخل اسمك الكريم هنا...",
    btnGetStarted: "ابدأ الآن وحلّق الميزانية",
    bannerDesc: "بيانات محفظتك آمنة تماماً ومحفوظة داخل ذاكرة الهاتف المحلية.",
    btnLogNew: "تسجيل معاملة جديدة",
    footerText: "© 2026 سبيند وايز للمالية الشخصية الآمنة. جميع الحقوق محفوظة.",
    footerInfo1: "بيانات مخزنة بجهازك فقط",
    footerInfo2: "● تخزين محلي آمن",
    alertBalance: "برجاء إدخال رقم صحيح أكبر من أو يساوي 0",
    confirmReset: "هل تود حقاً إعادة تعيين الحساب والعودة إلى المعاملات التجريبية الافتراضية؟",
    btnChangeName: "تعديل الاسم"
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'add_transaction'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [initialBalance, setInitialBalance] = useState<number>(1000.00);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState('1000.00');
  const [username, setUsername] = useState<string>('');
  const [tempName, setTempName] = useState<string>('');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  useEffect(() => {
    const savedName = localStorage.getItem('spendwise_username');
    const savedLang = localStorage.getItem('spendwise_lang');
    if (savedName) { setUsername(savedName); setIsRegistered(true); }
    if (savedLang === 'ar' || savedLang === 'en') setLanguage(savedLang);
    
    const storedTransactions = localStorage.getItem('spendwise_transactions');
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : DEFAULT_TRANSACTIONS);
  }, []);

  const saveTransactionsToOffline = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('spendwise_transactions', JSON.stringify(newTransactions));
  };

  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...newTxData, id: Date.now().toString() };
    saveTransactionsToOffline([newTx, ...transactions]);
    setCurrentScreen('dashboard');
  };

  const handleClearAllTransactions = () => saveTransactionsToOffline([]);
  
  const handleSaveBalance = () => {
    const parsed = parseFloat(balanceInput);
    if (!isNaN(parsed) && parsed >= 0) {
      setInitialBalance(parsed);
      localStorage.setItem('spendwise_initial_balance', parsed.toString());
      setIsEditingBalance(false);
    } else {
      alert(translations[language].alertBalance);
    }
  };

  const handleResetToDemo = () => {
    if (confirm(translations[language].confirmReset)) {
      saveTransactionsToOffline(DEFAULT_TRANSACTIONS);
      setInitialBalance(1000.00);
      setBalanceInput('1000.00');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUsername(tempName.trim());
      localStorage.setItem('spendwise_username', tempName.trim());
      setIsRegistered(true);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
    localStorage.setItem('spendwise_lang', nextLang);
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <AnimatePresence mode="wait">
        {!isRegistered ? (
          <motion.div key="welcome" className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-900">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center">
              <h2 className="text-2xl font-black mb-6">{t.welcomeTitle}</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <input type="text" required value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder={t.namePlaceholder} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">{t.btnGetStarted}</button>
              </form>
              <button onClick={toggleLanguage} className="mt-4 text-sm text-slate-400 font-bold hover:text-blue-600 underline">
                {language === 'ar' ? 'English' : 'تغيير اللغة للعربية'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="dashboard" className="flex flex-col flex-1">
            <header className="bg-white border-b p-4 flex justify-between items-center">
              <div className="font-bold text-lg text-slate-900">{t.title}</div>
              <button onClick={toggleLanguage} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700">
                <Languages className="w-3.5 h-3.5" /> {language === 'ar' ? 'English' : 'العربية'}
              </button>
            </header>
            <main className="p-4 max-w-3xl mx-auto w-full">
              {currentScreen === 'dashboard' ? (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h1 className="text-xl font-bold">{t.welcomeBack} {username}!</h1>
                    <button onClick={() => setCurrentScreen('add_transaction')} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">{t.btnLogNew}</button>
                  </div>
                  <DashboardStats transactions={transactions} initialBalance={initialBalance} />
                  <TransactionList 
                    transactions={transactions} 
                    onDeleteTransaction={(id) => saveTransactionsToOffline(transactions.filter(t => t.id !== id))}
                    onClearAllTransactions={handleClearAllTransactions}
                    onNavigateToAddTransaction={() => setCurrentScreen('add_transaction')}
                  />
                </div>
              ) : (
                <AddTransactionForm onSave={handleAddTransaction} onCancel={() => setCurrentScreen('dashboard')} />
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}