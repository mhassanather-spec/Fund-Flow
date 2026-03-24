import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  reason: string;
};

export type Budget = {
  id?: string;
  category: string;
  limit: number;
  icon: string;
};

export type SavingsGoal = {
  id: string;
  name: string;
  icon: string;
  target: number;
  saved: number;
  createdAt: string;
};

interface ExpenseContextType {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  budgets: Budget[];
  updateBudget: (category: string, limit: number) => Promise<void>;
  addBudget: (b: Budget) => Promise<void>;
  deleteBudget: (category: string) => Promise<void>;
  goals: SavingsGoal[];
  addGoal: (g: Omit<SavingsGoal, "id" | "saved" | "createdAt">) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  contributeToGoal: (id: string, amount: number) => Promise<void>;
  withdrawFromGoal: (id: string, amount: number) => Promise<void>;
  currency: string;
  setCurrency: (c: string) => void;
  // Derived
  totalSavings: number;
  mainBalance: number;
  loading: boolean;
}

const defaultBudgets: Omit<Budget, "id">[] = [
  { category: "Groceries", limit: 500, icon: "🛒" },
  { category: "Dining Out", limit: 200, icon: "🍔" },
  { category: "Transportation", limit: 150, icon: "🚗" },
  { category: "Entertainment", limit: 100, icon: "🎬" },
  { category: "Utilities", limit: 250, icon: "⚡" },
  { category: "Shopping", limit: 300, icon: "🛍️" },
];

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [currency, setCurrencyState] = useState<string>("$");
  const [loading, setLoading] = useState(true);

  // Fetch all data when user logs in
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Get currency from user metadata
    const meta = user.user_metadata;
    if (meta?.currency) setCurrencyState(meta.currency);

    // Fetch transactions
    const { data: txData } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (txData) {
      setTransactions(txData.map(t => ({
        id: t.id,
        title: t.title,
        amount: Number(t.amount),
        category: t.category,
        type: t.type as "income" | "expense",
        date: t.date,
        reason: t.reason || "",
      })));
    }

    // Fetch budgets
    const { data: budgetData } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id);

    if (budgetData && budgetData.length > 0) {
      setBudgets(budgetData.map(b => ({
        id: b.id,
        category: b.category,
        limit: Number(b.limit_amount),
        icon: b.icon,
      })));
    } else if (budgetData && budgetData.length === 0) {
      // First time user — seed default budgets
      const inserts = defaultBudgets.map(b => ({
        user_id: user.id,
        category: b.category,
        limit_amount: b.limit,
        icon: b.icon,
      }));
      const { data: seeded } = await supabase.from("budgets").insert(inserts).select();
      if (seeded) {
        setBudgets(seeded.map(b => ({
          id: b.id,
          category: b.category,
          limit: Number(b.limit_amount),
          icon: b.icon,
        })));
      }
    }

    // Fetch savings goals
    const { data: goalData } = await supabase
      .from("savings_goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (goalData) {
      setGoals(goalData.map(g => ({
        id: g.id,
        name: g.name,
        icon: g.icon,
        target: Number(g.target),
        saved: Number(g.saved),
        createdAt: g.created_at ? new Date(g.created_at).toISOString().split("T")[0] : "",
      })));
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setCurrency = async (c: string) => {
    setCurrencyState(c);
    if (user) {
      await supabase.auth.updateUser({ data: { currency: c } });
    }
  };

  const addTransaction = async (t: Omit<Transaction, "id">) => {
    if (!user) return;
    const { data, error } = await supabase.from("transactions").insert({
      user_id: user.id,
      title: t.title,
      amount: t.amount,
      category: t.category,
      type: t.type,
      date: t.date,
      reason: t.reason,
    }).select().single();

    if (!error && data) {
      setTransactions(prev => [{
        id: data.id,
        title: data.title,
        amount: Number(data.amount),
        category: data.category,
        type: data.type as "income" | "expense",
        date: data.date,
        reason: data.reason || "",
      }, ...prev]);
    }
  };

  const deleteTransaction = async (id: string) => {
    await supabase.from("transactions").delete().eq("id", id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = async (category: string, limit: number) => {
    if (!user) return;
    await supabase.from("budgets").update({ limit_amount: limit }).eq("user_id", user.id).eq("category", category);
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit } : b));
  };

  const addBudget = async (b: Budget) => {
    if (!user) return;
    if (budgets.some(e => e.category === b.category)) return;
    const { data, error } = await supabase.from("budgets").insert({
      user_id: user.id,
      category: b.category,
      limit_amount: b.limit,
      icon: b.icon,
    }).select().single();
    if (!error && data) {
      setBudgets(prev => [...prev, { id: data.id, category: data.category, limit: Number(data.limit_amount), icon: data.icon }]);
    }
  };

  const deleteBudget = async (category: string) => {
    if (!user) return;
    await supabase.from("budgets").delete().eq("user_id", user.id).eq("category", category);
    setBudgets(prev => prev.filter(b => b.category !== category));
  };

  // Savings Goals
  const addGoal = async (g: Omit<SavingsGoal, "id" | "saved" | "createdAt">) => {
    if (!user) return;
    const { data, error } = await supabase.from("savings_goals").insert({
      user_id: user.id,
      name: g.name,
      icon: g.icon,
      target: g.target,
      saved: 0,
    }).select().single();
    if (!error && data) {
      setGoals(prev => [...prev, {
        id: data.id,
        name: data.name,
        icon: data.icon,
        target: Number(data.target),
        saved: 0,
        createdAt: new Date(data.created_at).toISOString().split("T")[0],
      }]);
    }
  };

  const deleteGoal = async (id: string) => {
    await supabase.from("savings_goals").delete().eq("id", id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Contribute = move money FROM main balance TO savings account
  const contributeToGoal = async (id: string, amount: number) => {
    if (!user) return;
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    // Update savings goal
    await supabase.from("savings_goals").update({ saved: goal.saved + amount }).eq("id", id);
    setGoals(prev => prev.map(g => g.id === id ? { ...g, saved: g.saved + amount } : g));

    // Record as expense transaction
    await addTransaction({
      title: `Transfer to Savings: ${goal.name}`,
      amount,
      category: "Savings Transfer",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      reason: `Moved to savings goal "${goal.name}"`,
    });
  };

  // Withdraw = move money FROM savings back TO main balance
  const withdrawFromGoal = async (id: string, amount: number) => {
    if (!user) return;
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newSaved = Math.max(goal.saved - amount, 0);
    await supabase.from("savings_goals").update({ saved: newSaved }).eq("id", id);
    setGoals(prev => prev.map(g => g.id === id ? { ...g, saved: newSaved } : g));

    await addTransaction({
      title: `Withdraw from Savings: ${goal.name}`,
      amount,
      category: "Savings Transfer",
      type: "income",
      date: new Date().toISOString().split("T")[0],
      reason: `Withdrawn from savings goal "${goal.name}"`,
    });
  };

  // Derived values
  const totalSavings = goals.reduce((s, g) => s + g.saved, 0);
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const mainBalance = income - expenses;

  return (
    <ExpenseContext.Provider value={{
      transactions, addTransaction, deleteTransaction,
      budgets, updateBudget, addBudget, deleteBudget,
      goals, addGoal, deleteGoal, contributeToGoal, withdrawFromGoal,
      currency, setCurrency,
      totalSavings, mainBalance, loading,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("useExpense must be used within ExpenseProvider");
  return context;
}
