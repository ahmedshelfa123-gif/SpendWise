
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
      alert(translations[language].alertBalance);
    }
  };

  // Seed back original starter data (Reset system)
  const handleResetToDemo = () => {
    if (window.confirm(translations[language].confirmReset)) {
      saveTransactionsToOffline(DEFAULT_TRANSACTIONS);
      setInitialBalance(1000.00);
      setBalanceInput('1000.00');
      localStorage.setItem('spendwise_initial_balance', '1000.00');
    }
  };

  // الدخول وحفظ اسم الحساب
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim().length > 0) {
      setUsername(tempName.trim());
      localStorage.setItem('spendwise_username', tempName.trim());
      setIsRegistered(true);
    }
  };

  // تبديل لغة الحساب التفاعلي
  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
    localStorage.setItem('spendwise_lang', nextLang);
  };

  // تعديل أو تصفير اسم الحساب للعودة لشاشة الدخول
  const handleResetName = () => {
    localStorage.removeItem('spendwise_username');
    setUsername('');
    setTempName('');
    setIsRegistered(false);
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900" 
      id="spendwise-app"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <AnimatePresence mode="wait">
        {!isRegistered ? (
          /* واجهة ترحيبية مهيأة بالكامل للمستخدم لتسجيل الاسم لأول مرة */
          <motion.div
            key="welcome-flow-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-900"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-10 w-full max-w-md shadow-2xl text-center border border-white/10">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-5 shadow-inner">
                <Wallet className="h-7 w-7 stroke-[2.2]" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 font-display tracking-tight">{t.welcomeTitle}</h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed px-2">{t.welcomeSubtitle}</p>
              
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className={`w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all shadow-xs ${isRTL ? 'text-right' : 'text-left'}`}
                />
                <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-md shadow-blue-600/30 active:scale-[0.98]">
                  {t.btnGetStarted}
                </button>
              </form>

              <button 
                onClick={toggleLanguage} 
                className="mt-6 inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
              >
                <Languages className="h-4 w-4" />
                {language === 'ar' ? 'English' : 'العربية'}
              </button>
            </div>
          </motion.div>
        ) : (
          /* واجهة الأبلكيشن الرئيسية والداشبورد بعد التعديل */
          <motion.div key="main-app-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1">
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
                      <span className="text-xl font-extrabold font-display tracking-tight text-slate-900">{t.title}</span>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-100/50 uppercase">Offline</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">{t.subtitle}</p>
                  </div>
                </div>

                {/* الحساب الترحيبي الخاص بالعميل المتغير */}
                <div className="flex items-center gap-2 bg-blue-50/60 border border-blue-100/40 px-3 py-1.5 rounded-xl self-start sm:self-auto text-xs">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-slate-500 font-medium">{t.welcomeBack}</span>
                  <span className="font-bold text-slate-900 truncate max-w-[120px]">{username}</span>
                  <button onClick={handleResetName} title={t.btnChangeName} className="text-slate-400 hover:text-blue-600 p-0.5 transition-colors">
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>

                {/* User Context & Starting Balance settings */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs" id="header-controls">
                  
                  {/* زر تبديل اللغة الفوري والأنيق */}
                  <button 
                    onClick={toggleLanguage}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/50 font-bold text-slate-700 transition-all active:scale-95"
                  >
                    <Languages className="h-3.5 w-3.5 text-slate-500" />
                    <span>{language === 'ar' ? 'English' : 'العربية'}</span>
                  </button>

                  {/* Initial balance manager */}
                  <div className="flex items-center bg-slate-100/80 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200/50 transition-colors">
                    <span className={`text-slate-500 font-medium ${isRTL ? 'ml-1.5' : 'mr-1.5'}`}>{t.startingCash}</span>
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
                          {t.welcomeBack} {username}!
                          <Sparkles className="h-5 w-5 text-amber-500 fill-amber-400 animate-pulse" />
                        </h1>
                        <p className="text-slate-500 text-xs mt-1">
                          {t.bannerDesc}
                        </p>
                      </div>
                      <button
                        id="btn-add-floating"
                        onClick={() => setCurrentScreen('add_transaction')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                      >
                        <PlusCircle className="h-5 w-5" />
                        {t.btnLogNew}
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
                <p>{t.footerText}</p>
                <div className="flex gap-4">
                  <span className="hover:text-slate-600 cursor-help flex items-center gap-1">
                    <Wallet className="h-3 w-3 text-blue-500" />
                    {t.footerInfo1}
                  </span>
                  <span className="border-l border-slate-200 pl-4 text-emerald-600 font-semibold">
                    {t.footerInfo2}
                  </span>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnPresence>
    </div>
  );
}