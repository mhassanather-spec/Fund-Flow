import { motion } from "framer-motion";
import { useState } from "react";
import { Trash2, Receipt, Plus, DollarSign, CreditCard, Download } from "lucide-react";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EXPENSE_CATEGORIES = [
  "Groceries", "Dining Out", "Transportation", "Entertainment",
  "Utilities", "Shopping", "Healthcare", "Rent", "Education",
  "Subscriptions", "Personal Care", "Clothing", "Fuel",
  "Insurance", "Gifts", "Pet Care", "Home Maintenance",
  "Debt Repayment", "Travel", "Miscellaneous"
];

const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Business", "Investment Returns",
  "Rental Income", "Side Hustle", "Bonus", "Gift Received", "Other"
];

export default function Expenses() {
  const { user } = useAuth();
  const { transactions, addTransaction, deleteTransaction, currency } = useExpense();
  const [tab, setTab] = useState<"income" | "expense">("income");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");
  const [reason, setReason] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const categories = tab === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const switchTab = (t: "income" | "expense") => {
    setTab(t);
    setCategory(t === "income" ? "Salary" : "Groceries");
    setTitle("");
    setAmount("");
    setReason("");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    addTransaction({
      title,
      amount: Number(amount),
      category,
      type: tab,
      date: new Date().toISOString().split("T")[0],
      reason,
    });
    setTitle("");
    setAmount("");
    setReason("");
  };

  const incomeTotal = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenseTotal = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const filteredTransactions = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  const generatePDF = () => {
    const doc = new jsPDF();
    const balance = incomeTotal - expenseTotal;
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(23, 72, 133); // #174885
    doc.text("FundFlow Financial Report", 14, 22);
    
    // Subheader info
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    if (user?.user_metadata?.name) {
      doc.text(`Account: ${user.user_metadata.name}`, 14, 36);
    }

    // Summary Box
    doc.setDrawColor(200);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(14, 42, 182, 30, 3, 3, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text("Total Income:", 20, 52);
    doc.setTextColor(16, 185, 129); // emerald
    doc.text(`+${currency}${incomeTotal.toFixed(2)}`, 60, 52);
    
    doc.setTextColor(50);
    doc.text("Total Expenses:", 20, 62);
    doc.setTextColor(239, 68, 68); // red
    doc.text(`-${currency}${expenseTotal.toFixed(2)}`, 60, 62);
    
    doc.setTextColor(50);
    doc.text("Net Balance:", 120, 57);
    doc.setTextColor(balance >= 0 ? 16 : 239, balance >= 0 ? 185 : 68, balance >= 0 ? 129 : 68);
    doc.text(`${balance >= 0 ? '+' : ''}${currency}${balance.toFixed(2)}`, 160, 57);

    // Filter label
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Transactions (${filter === 'all' ? 'All' : filter === 'income' ? 'Income Only' : 'Expenses Only'})`, 14, 85);

    // Table
    const tableData = filteredTransactions.map(t => [
      t.date,
      t.title,
      t.category,
      t.type === 'income' ? 'Income' : 'Expense',
      `${t.type === 'income' ? '+' : '-'}${currency}${t.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 90,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [23, 72, 133] },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 4) { // Amount column
          if ((data.row.raw as any)[3] === 'Income') {
            data.cell.styles.textColor = [16, 185, 129];
          } else {
            data.cell.styles.textColor = [239, 68, 68];
          }
        }
      }
    });

    doc.save("fundflow_report.pdf");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Balance</p>
          <p className={`text-2xl font-extrabold ${incomeTotal - expenseTotal >= 0 ? "text-primary" : "text-red-500"}`}>
            {currency}{(incomeTotal - expenseTotal).toLocaleString()}
          </p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Income</p>
          <p className="text-2xl font-extrabold text-emerald-700">+{currency}{incomeTotal.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Spent</p>
          <p className="text-2xl font-extrabold text-red-600">-{currency}{expenseTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* BIG TAB SWITCHER */}
      <div className="grid grid-cols-2 gap-0 bg-gray-100 rounded-2xl p-1.5">
        <button onClick={() => switchTab("income")}
          className={`py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            tab === "income" ? "bg-emerald-500 text-white shadow-md" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <DollarSign className="w-5 h-5" />
          💰 Add Salary / Income
        </button>
        <button onClick={() => switchTab("expense")}
          className={`py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            tab === "expense" ? "bg-red-500 text-white shadow-md" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <CreditCard className="w-5 h-5" />
          💳 Add Expense
        </button>
      </div>

      {/* Form */}
      <div className={`bg-white p-6 rounded-[2rem] border shadow-sm relative overflow-hidden ${
        tab === "income" ? "border-emerald-200" : "border-red-200"
      }`}>
        <div className={`absolute top-0 left-0 w-full h-1.5 ${tab === "income" ? "bg-emerald-400" : "bg-red-400"}`} />
        <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
          {tab === "income" ? "📥 Record Your Income" : "📤 Record Your Expense"}
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                {tab === "income" ? "Income Source" : "What did you buy?"}
              </label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder={tab === "income" ? "e.g. Monthly Salary" : "e.g. Walmart Groceries"}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Amount ({currency})</label>
              <input required type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none cursor-pointer">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              {tab === "income" ? "Note (optional)" : "Why did you spend this?"}
            </label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder={tab === "income" ? "e.g. March paycheck from company" : "e.g. Weekly family groceries"}
            />
          </div>
          <button type="submit"
            className={`px-8 py-3.5 rounded-xl text-white font-bold shadow-sm transition-colors flex items-center gap-2 text-base ${
              tab === "income" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            <Plus className="w-5 h-5" />
            {tab === "income" ? "Add Income" : "Add Expense"}
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Transaction History</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mr-2">
              {(["all", "income", "expense"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >{f}</button>
              ))}
            </div>
            <button onClick={generatePDF} disabled={transactions.length === 0}
              className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Receipt className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-bold tracking-tight mb-1">No transactions yet</h3>
              <p className="text-gray-500 text-sm font-medium">Use the tabs above to add your salary or expenses!</p>
            </div>
          )}
          {filteredTransactions.map((t) => (
            <div key={t.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-sm border flex-shrink-0 ${
                  t.type === "income" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"
                }`}>
                  {t.type === "income" ? "💰" : "💳"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{t.title}</h3>
                  <p className="text-xs font-medium text-gray-400 truncate">{t.category} • {t.date}</p>
                  {t.reason && <p className="text-xs text-gray-500 italic mt-0.5 truncate">"{t.reason}"</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className={`font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                  {t.type === "income" ? "+" : "-"}{currency}{t.amount.toFixed(2)}
                </span>
                <button onClick={() => deleteTransaction(t.id)} className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
