import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Target, ArrowRightLeft } from "lucide-react";
import { MetricCard } from "../components/dashboard/MetricCard";
import { IncomeExpenseChart } from "../components/dashboard/IncomeExpenseChart";
import { useExpense } from "../context/ExpenseContext";

export default function Dashboard() {
  const { transactions, currency, budgets, goals, totalSavings, mainBalance } = useExpense();
  
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const overBudget = budgets.filter(b => {
    const spent = transactions.filter(t => t.type === 'expense' && t.category === b.category).reduce((s, t) => s + t.amount, 0);
    return b.limit > 0 && spent > b.limit;
  }).length;

  const fmt = (n: number) => `${currency}${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Overview</h1>
        <span className="text-sm text-gray-500 font-medium">{transactions.length} transactions</span>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Main Balance" value={fmt(mainBalance)} icon={Wallet} trend="Spendable" isPositive={mainBalance >= 0} />
        <MetricCard title="Savings Account" value={fmt(totalSavings)} icon={PiggyBank} trend={`${goals.length} goals`} isPositive={true} />
        <MetricCard title="Total Income" value={fmt(income)} icon={TrendingUp} trend="All time" isPositive={true} />
        <MetricCard title="Total Expenses" value={fmt(expenses)} icon={TrendingDown} trend="All time" isPositive={false} />
        <MetricCard title="Net Worth" value={fmt(mainBalance + totalSavings)} icon={ArrowRightLeft} trend={overBudget > 0 ? `${overBudget} over` : "Healthy"} isPositive={overBudget === 0} />
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-xs text-blue-800 font-medium">
        💡 <strong>Main Balance</strong> = your spendable money. <strong>Savings Account</strong> = money locked in goals. <strong>Net Worth</strong> = both combined.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
          <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Cash Flow</h2>
          <p className="text-xs text-gray-400 font-medium mb-4">Real transactions grouped by month</p>
          <IncomeExpenseChart transactions={transactions} currency={currency} />
        </div>

        {/* Savings Goals Summary */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary" />
          <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Savings Goals
          </h2>
          
          {goals.length === 0 ? (
            <div className="mt-4 text-center py-8">
              <p className="text-gray-400 text-sm font-medium">No goals yet</p>
              <p className="text-gray-400 text-xs mt-1">Go to Planner to create one!</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {goals.map(goal => {
                const pct = goal.target > 0 ? Math.min((goal.saved / goal.target) * 100, 100) : 0;
                const isComplete = goal.saved >= goal.target;
                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <span>{goal.icon}</span> {goal.name}
                      </span>
                      <span className={`text-xs font-bold ${isComplete ? "text-emerald-600" : "text-gray-500"}`}>
                        {isComplete ? "✅ Done" : `${Math.round(pct)}%`}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${isComplete ? "bg-emerald-400" : "bg-primary"}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                      <span>{currency}{goal.saved.toLocaleString()}</span>
                      <span>{currency}{goal.target.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {transactions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Latest</h3>
              {transactions.slice(0, 3).map(t => (
                <div key={t.id} className="flex items-center justify-between py-1.5">
                  <span className="text-xs font-medium text-gray-700 truncate mr-2">{t.title}</span>
                  <span className={`text-xs font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}{currency}{t.amount.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
