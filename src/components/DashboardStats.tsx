import React from 'react';
import { Transaction, TransactionCategory } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Utensils, 
  Car, 
  Zap, 
  HeartPulse, 
  HelpCircle,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface DashboardStatsProps {
  transactions: Transaction[];
  initialBalance: number;
}

// Map category to icons and soft background colors
export const categoryConfig: Record<TransactionCategory, { icon: React.ComponentType<any>; color: string; bg: string; text: string }> = {
  Shopping: { icon: ShoppingBag, color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-600' },
  Food: { icon: Utensils, color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600' },
  Transport: { icon: Car, color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  Utilities: { icon: Zap, color: '#8b5cf6', bg: 'bg-violet-50', text: 'text-violet-600' },
  Health: { icon: HeartPulse, color: '#ef4444', bg: 'bg-rose-50', text: 'text-rose-600' },
  Other: { icon: HelpCircle, color: '#64748b', bg: 'bg-slate-100', text: 'text-slate-600' },
};

export default function DashboardStats({ transactions, initialBalance }: DashboardStatsProps) {
  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = initialBalance + totalIncome - totalExpense;

  // Prepare Pie Chart data (Expense by category)
  const categorySums = transactions
    .filter(t => t.type === 'expense')
    .reduce<Record<TransactionCategory, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<TransactionCategory, number>);

  const pieData = (Object.keys(categorySums) as TransactionCategory[]).map(cat => ({
    name: cat,
    value: parseFloat(categorySums[cat].toFixed(2)),
    color: categoryConfig[cat]?.color || '#64748b'
  })).filter(item => item.value > 0);

  // Prepare Area Chart data (Spending trend over time, grouped by date)
  // Get last 7 active dates sorted chronologically
  const expensesByDate = transactions
    .filter(t => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.date] = (acc[t.date] || 0) + t.amount;
      return acc;
    }, {});

  const dates = Object.keys(expensesByDate).sort();
  const trendData = dates.map(date => {
    const d = new Date(date + 'T00:00:00');
    const formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return {
      date: formattedDate,
      amount: parseFloat(expensesByDate[date].toFixed(2)),
      rawDate: date
    };
  }).slice(-7); // take last 7 data points

  return (
    <div className="space-y-6" id="dashboard-stats-root">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Balance Card */}
        <div 
          id="metric-balance-card"
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-md transition-all hover:shadow-lg"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium tracking-wide uppercase">Current Balance</p>
              <h3 className="text-3xl font-bold font-display mt-1 tracking-tight">
                ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-blue-100 bg-white/10 py-1.5 px-3 rounded-lg w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Offline Wallet Active
          </div>
        </div>

        {/* Income Card */}
        <div 
          id="metric-income-card"
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Income</p>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">
                ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
              Inflow
            </span>
            recorded from logs
          </div>
        </div>

        {/* Spending Card */}
        <div 
          id="metric-spending-card"
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Spendings</p>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">
                ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <TrendingDown className="h-6 w-6 text-rose-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-rose-600 font-semibold flex items-center">
              <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
              Outflow
            </span>
            logged offline
          </div>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Trend Area Chart */}
        <div 
          id="trend-chart-card"
          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs lg:col-span-3 flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Spending Trend</h4>
              <p className="text-xs text-slate-500">Expense history of last 7 active transaction days</p>
            </div>
          </div>
          <div className="h-60 w-full flex-1">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderRadius: '12px', 
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => [`$${value}`, 'Expense']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                <DollarSign className="h-10 w-10 text-slate-300 stroke-1 mb-2" />
                No expenses logged to view trend chart
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div 
          id="category-breakdown-card"
          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs lg:col-span-2 flex flex-col justify-between"
        >
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <PieIcon className="h-4.5 w-4.5 text-blue-600" />
              Category Breakdown
            </h4>
            <p className="text-xs text-slate-500 mb-4">Percentage of total expenses</p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-around gap-4 flex-1">
            {pieData.length > 0 ? (
              <>
                <div className="relative w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total</span>
                    <span className="text-sm font-bold text-slate-800">${totalExpense.toFixed(0)}</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full text-xs">
                  {pieData.map((item, index) => {
                    const percentage = totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(0) : '0';
                    return (
                      <div key={index} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 font-medium truncate max-w-[80px]">{item.name}</span>
                        <span className="text-slate-400 ml-auto">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm flex-1 flex flex-col items-center justify-center">
                <PieIcon className="h-10 w-10 text-slate-300 stroke-1 mb-2" />
                No expenses logged for category split
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
