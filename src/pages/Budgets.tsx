import { motion } from "framer-motion";
import { useState } from "react";
import { useExpense } from "../context/ExpenseContext";
import { AlertCircle, CheckCircle, Pencil, Check, X, Plus, Trash2, Minus } from "lucide-react";

const EMOJI_OPTIONS = ["📦", "🏠", "🎓", "💊", "🐕", "🎁", "📱", "✈️", "🏋️", "🎵", "💇", "🧾", "🔧", "🚌", "☕"];

export default function Budgets() {
  const { budgets, transactions, currency, updateBudget, addBudget, deleteBudget, addTransaction } = useExpense();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [spendingOn, setSpendingOn] = useState<string | null>(null);
  const [spendAmount, setSpendAmount] = useState("");
  const [spendNote, setSpendNote] = useState("");

  // Create custom budget state
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [newIcon, setNewIcon] = useState("📦");

  const startEdit = (category: string, currentLimit: number) => {
    setEditingCategory(category);
    setEditValue(currentLimit.toString());
  };

  const saveEdit = (category: string) => {
    const val = Number(editValue);
    if (val > 0) updateBudget(category, val);
    setEditingCategory(null);
  };

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newLimit) return;
    addBudget({ category: newName.trim(), limit: Number(newLimit), icon: newIcon });
    setNewName("");
    setNewLimit("");
    setNewIcon("📦");
    setShowCreate(false);
  };

  const handleQuickSpend = (category: string) => {
    if (!spendAmount || Number(spendAmount) <= 0) return;
    addTransaction({
      title: `${category} spending`,
      amount: Number(spendAmount),
      category,
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      reason: spendNote || "",
    });
    setSpendAmount("");
    setSpendNote("");
    setSpendingOn(null);
  };

  const totalBudgetLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => {
    return s + transactions.filter(t => t.type === "expense" && t.category === b.category).reduce((sum, t) => sum + t.amount, 0);
  }, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto">
      
      {/* How it works banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-800 font-medium">
        💡 <strong>How Budgets work:</strong> Set a spending limit per category → click <strong>"Spend"</strong> on any card to record an expense → watch the progress bar fill up. That's it!
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Monthly Budgets</h1>
          <p className="text-gray-500 text-sm font-medium">
            Budget: <strong className="text-gray-900">{currency}{totalBudgetLimit.toLocaleString()}</strong> · 
            Spent: <strong className={totalSpent > totalBudgetLimit ? "text-red-500" : "text-primary"}>{currency}{totalSpent.toLocaleString()}</strong>
          </p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold shadow-sm transition-colors">
          <Plus className="w-5 h-5" /> Create Budget
        </button>
      </div>

      {/* Create Custom Budget */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="bg-white p-6 rounded-[2rem] border border-primary/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
          <h2 className="text-lg font-bold text-gray-900 mb-4">✨ Create Your Own Budget</h2>
          <form onSubmit={handleCreateBudget} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Budget Name</label>
                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Gym, Netflix, Tuition..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Monthly Limit ({currency})</label>
                <input required type="number" step="0.01" value={newLimit} onChange={e => setNewLimit(e.target.value)} placeholder="0.00"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Pick Icon</label>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJI_OPTIONS.map(e => (
                    <button key={e} type="button" onClick={() => setNewIcon(e)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${newIcon === e ? "bg-primary/10 border-2 border-primary" : "bg-gray-50 border border-gray-200"}`}
                    >{e}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Budget</button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, i) => {
          const spent = transactions.filter(t => t.type === "expense" && t.category === budget.category).reduce((sum, t) => sum + t.amount, 0);
          const percentage = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0;
          const isOver = budget.limit > 0 && spent > budget.limit;
          const isNearLimit = percentage >= 85 && !isOver;
          const isEditing = editingCategory === budget.category;
          const isSpending = spendingOn === budget.category;

          return (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-xl border border-gray-100">{budget.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 tracking-tight">{budget.category}</h3>
                    {isEditing ? (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-bold text-gray-500">{currency}</span>
                        <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus
                          onKeyDown={e => { if (e.key === "Enter") saveEdit(budget.category); if (e.key === "Escape") setEditingCategory(null); }}
                          className="w-20 text-xs bg-gray-50 border border-primary rounded-lg px-2 py-1 font-bold outline-none" />
                        <button onClick={() => saveEdit(budget.category)} className="p-1 bg-primary text-white rounded-lg"><Check className="w-3 h-3" /></button>
                        <button onClick={() => setEditingCategory(null)} className="p-1 bg-gray-200 text-gray-600 rounded-lg"><X className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{currency}{budget.limit.toLocaleString()} Limit</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {!isEditing && (
                    <button onClick={() => startEdit(budget.category, budget.limit)} className="p-2 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="Edit limit">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => deleteBudget(budget.category)} className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm font-bold">
                  <span className={isOver ? "text-red-600" : "text-gray-900"}>{currency}{spent.toLocaleString()} Spent</span>
                  <span className="text-gray-500 font-medium">{budget.limit > 0 ? `${currency}${Math.max(budget.limit - spent, 0).toLocaleString()} Left` : "No limit"}</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${isOver ? "bg-red-500" : isNearLimit ? "bg-amber-400" : "bg-primary"}`}
                    style={{ width: `${budget.limit > 0 ? percentage : 0}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  {isOver ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg"><AlertCircle className="w-3 h-3" /> Over</span>
                  ) : isNearLimit ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg"><AlertCircle className="w-3 h-3" /> Near</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg"><CheckCircle className="w-3 h-3" /> OK</span>
                  )}
                  <span className="text-xs font-bold text-gray-400">{budget.limit > 0 ? `${Math.round(percentage)}%` : "—"}</span>
                </div>
              </div>

              {/* QUICK SPEND — the key feature */}
              {isSpending ? (
                <div className="bg-red-50 rounded-xl p-3 border border-red-100 space-y-2">
                  <input type="number" step="0.01" value={spendAmount} onChange={e => setSpendAmount(e.target.value)} placeholder={`Amount (${currency})`} autoFocus
                    className="w-full bg-white border border-red-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-red-200" />
                  <input type="text" value={spendNote} onChange={e => setSpendNote(e.target.value)} placeholder="What for? (optional)"
                    className="w-full bg-white border border-red-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-red-200" />
                  <div className="flex gap-2">
                    <button onClick={() => handleQuickSpend(budget.category)} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-xs font-bold">Confirm</button>
                    <button onClick={() => { setSpendingOn(null); setSpendAmount(""); setSpendNote(""); }} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 text-xs font-bold">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setSpendingOn(budget.category)}
                  className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm border border-red-100 transition-colors flex items-center justify-center gap-2">
                  <Minus className="w-4 h-4" /> Record Spending
                </button>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
