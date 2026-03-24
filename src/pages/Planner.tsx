import { motion } from "framer-motion";
import { Target, Home, Plus, Trash2, ArrowDown, ArrowUp, X } from "lucide-react";
import { useState } from "react";
import { useExpense } from "../context/ExpenseContext";

const GOAL_ICONS = ["🎯", "🏠", "🚗", "✈️", "🎓", "💍", "📱", "🏥", "👶", "🐕", "💎", "🏖️", "🎮", "🔧", "🛡️"];

export default function Planner() {
  const { goals, addGoal, deleteGoal, contributeToGoal, withdrawFromGoal, currency } = useExpense();

  // Create goal
  const [showCreate, setShowCreate] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalIcon, setGoalIcon] = useState("🎯");

  // Contribute/Withdraw
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"add" | "withdraw">("add");
  const [actionAmount, setActionAmount] = useState("");

  // Mortgage
  const [homeValue, setHomeValue] = useState(350000);
  const [downPercent, setDownPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanYears, setLoanYears] = useState(30);

  const loanAmount = homeValue * (1 - downPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanYears * 12;
  const monthlyPayment = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
    : loanAmount / totalPayments;
  const totalInterest = (monthlyPayment * totalPayments) - loanAmount;

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName.trim() || !goalTarget) return;
    addGoal({ name: goalName.trim(), target: Number(goalTarget), icon: goalIcon });
    setGoalName("");
    setGoalTarget("");
    setGoalIcon("🎯");
    setShowCreate(false);
  };

  const handleAction = (goalId: string) => {
    const amt = Number(actionAmount);
    if (amt <= 0) return;
    if (actionType === "add") contributeToGoal(goalId, amt);
    else withdrawFromGoal(goalId, amt);
    setActionAmount("");
    setActiveGoalId(null);
  };

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Savings Goals & Planner</h1>
          {goals.length > 0 && (
            <p className="text-gray-500 text-sm font-medium">
              Total Saved: <strong className="text-primary">{currency}{totalSaved.toLocaleString()}</strong> of {currency}{totalTarget.toLocaleString()}
            </p>
          )}
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold shadow-sm transition-colors">
          <Plus className="w-5 h-5" /> New Savings Goal
        </button>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-800 font-medium">
        💡 <strong>How Savings Goals work:</strong> Create a goal → click <strong>"Add Money"</strong> to save towards it → watch progress fill up. Withdraw anytime if needed.
      </div>

      {/* Create Goal Form */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[2rem] border border-primary/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
          <h2 className="text-lg font-bold text-gray-900 mb-4">🎯 Create a New Savings Goal</h2>
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Goal Name</label>
                <input required type="text" value={goalName} onChange={e => setGoalName(e.target.value)}
                  placeholder="e.g. Emergency Fund, New Car, Vacation..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Target Amount ({currency})</label>
                <input required type="number" step="0.01" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} placeholder="0.00"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Pick Icon</label>
              <div className="flex flex-wrap gap-1.5">
                {GOAL_ICONS.map(e => (
                  <button key={e} type="button" onClick={() => setGoalIcon(e)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${goalIcon === e ? "bg-primary/10 border-2 border-primary" : "bg-gray-50 border border-gray-200"}`}
                  >{e}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Create Goal</button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Savings Goal Cards */}
      {goals.length === 0 && !showCreate && (
        <div className="bg-white p-12 rounded-[2rem] border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Target className="w-7 h-7 text-primary" /></div>
          <h3 className="text-gray-900 font-bold text-lg mb-1">No savings goals yet</h3>
          <p className="text-gray-500 text-sm font-medium">Click "New Savings Goal" above to start saving for something!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const percentage = goal.target > 0 ? Math.min((goal.saved / goal.target) * 100, 100) : 0;
          const isComplete = goal.saved >= goal.target;
          const isActive = activeGoalId === goal.id;

          return (
            <div key={goal.id} className={`bg-white p-6 rounded-[2rem] border shadow-sm relative overflow-hidden transition-colors ${isComplete ? "border-emerald-200" : "border-gray-100 hover:border-primary/30"}`}>
              {isComplete && <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-400" />}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl border border-gray-100">{goal.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 tracking-tight text-lg">{goal.name}</h3>
                    <p className="text-xs text-gray-400 font-medium">Created {goal.createdAt}</p>
                  </div>
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete goal">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm font-bold">
                  <span className={isComplete ? "text-emerald-600" : "text-gray-900"}>{currency}{goal.saved.toLocaleString()} saved</span>
                  <span className="text-gray-500 font-medium">of {currency}{goal.target.toLocaleString()}</span>
                </div>
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${isComplete ? "bg-emerald-400" : "bg-primary"}`}
                    style={{ width: `${percentage}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  {isComplete ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">🎉 Goal Reached!</span>
                  ) : (
                    <span className="text-xs font-bold text-gray-500">{currency}{(goal.target - goal.saved).toLocaleString()} remaining</span>
                  )}
                  <span className="text-xs font-extrabold text-primary">{Math.round(percentage)}%</span>
                </div>
              </div>

              {/* Action buttons */}
              {isActive ? (
                <div className={`rounded-xl p-3 border space-y-2 ${actionType === "add" ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setActionType("add")}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${actionType === "add" ? "bg-emerald-500 text-white" : "bg-white text-gray-500"}`}>
                      Add Money
                    </button>
                    <button type="button" onClick={() => setActionType("withdraw")}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${actionType === "withdraw" ? "bg-red-500 text-white" : "bg-white text-gray-500"}`}>
                      Withdraw
                    </button>
                  </div>
                  <input type="number" step="0.01" value={actionAmount} onChange={e => setActionAmount(e.target.value)} 
                    placeholder={`Amount (${currency})`} autoFocus
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium outline-none" />
                  <div className="flex gap-2">
                    <button onClick={() => handleAction(goal.id)}
                      className={`flex-1 py-2.5 rounded-lg text-white text-xs font-bold ${actionType === "add" ? "bg-emerald-500" : "bg-red-500"}`}>
                      Confirm
                    </button>
                    <button onClick={() => { setActiveGoalId(null); setActionAmount(""); }}
                      className="px-4 py-2.5 rounded-lg bg-gray-200 text-gray-600 text-xs font-bold">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setActiveGoalId(goal.id); setActionType("add"); }}
                    className="py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold text-sm border border-emerald-100 transition-colors flex items-center justify-center gap-1.5">
                    <ArrowDown className="w-4 h-4" /> Add Money
                  </button>
                  <button onClick={() => { setActiveGoalId(goal.id); setActionType("withdraw"); }}
                    className="py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 font-bold text-sm border border-red-100 transition-colors flex items-center justify-center gap-1.5">
                    <ArrowUp className="w-4 h-4" /> Withdraw
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mortgage Estimator */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20 shadow-sm"><Home className="w-6 h-6 text-accent" /></div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Mortgage Estimator</h2>
            <p className="text-gray-500 text-xs font-medium">Simulate housing costs</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-800 block mb-2">Home Value</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">{currency}</span>
                <input type="number" value={homeValue} onChange={e => setHomeValue(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-900 font-bold outline-none focus:ring-2 focus:ring-accent/10 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-800 block mb-2">Down Payment</label>
                <div className="relative">
                  <input type="number" value={downPercent} onChange={e => setDownPercent(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-bold outline-none focus:ring-2 focus:ring-accent/10 transition-all" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-800 block mb-2">Interest Rate</label>
                <div className="relative">
                  <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-bold outline-none focus:ring-2 focus:ring-accent/10 transition-all" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-800 block mb-2">Loan Term</label>
              <select value={loanYears} onChange={e => setLoanYears(Number(e.target.value))}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-bold outline-none cursor-pointer">
                <option value={30}>30 Years</option><option value={25}>25 Years</option><option value={20}>20 Years</option>
                <option value={15}>15 Years</option><option value={10}>10 Years</option><option value={5}>5 Years</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="text-gray-500 text-sm font-bold mb-2 uppercase tracking-wider">Monthly Payment</span>
            <span className="text-5xl font-extrabold text-accent tracking-tight">
              {currency}{monthlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="grid grid-cols-2 gap-3 mt-6 w-full">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Loan</p>
                <p className="text-sm font-bold text-gray-900">{currency}{loanAmount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Interest</p>
                <p className="text-sm font-bold text-red-500">{currency}{Math.round(totalInterest).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
