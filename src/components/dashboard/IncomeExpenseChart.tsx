import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { Transaction } from "../../context/ExpenseContext";

interface Props {
  transactions: Transaction[];
  currency: string;
}

export function IncomeExpenseChart({ transactions, currency }: Props) {
  // Group transactions by month from real data
  const monthMap: Record<string, { income: number; expenses: number }> = {};
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 };
    if (t.type === "income") monthMap[key].income += t.amount;
    else monthMap[key].expenses += t.amount;
  });

  // Sort and take last 7 months or whatever exists
  const sortedKeys = Object.keys(monthMap).sort();
  const data = sortedKeys.map(key => {
    const [, m] = key.split("-");
    return {
      name: monthNames[Number(m)],
      income: Math.round(monthMap[key].income),
      expenses: Math.round(monthMap[key].expenses),
    };
  });

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-gray-400 text-sm font-medium">
        Add transactions to see your cash flow chart here.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#15BE77" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#15BE77" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#174885" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#174885" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => `${currency}${value.toLocaleString()}`}
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px' }}
            itemStyle={{ color: '#111827' }}
          />
          <Area type="monotone" dataKey="income" stroke="#15BE77" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
          <Area type="monotone" dataKey="expenses" stroke="#174885" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Expenses" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
