import { motion } from "framer-motion";
import { TrendingUp, PiggyBank, Target, ArrowRight, BarChart3, Wallet } from "lucide-react";
import { PublicNav } from "../components/layout/PublicNav";
import { Link } from "react-router-dom";

export default function Landing() {
  const features = [
    { icon: Wallet, title: "Track Spending", desc: "Record income & expenses in seconds", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: BarChart3, title: "Smart Budgets", desc: "Set limits per category & stay on track", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Target, title: "Savings Goals", desc: "Save for what matters most to you", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: TrendingUp, title: "Cash Flow", desc: "Visualize your money flow over time", color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#e8f5e9] flex flex-col">
      <PublicNav />

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16 pt-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-sm px-5 py-2.5 rounded-full mb-8 tracking-wide uppercase">
            <PiggyBank className="w-5 h-5" /> Smart Financial Tracking
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            Take control of your{" "}
            <span className="bg-gradient-to-r from-[#174885] to-primary bg-clip-text text-transparent">finances</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Track expenses, set budgets, save towards goals — all in one beautiful app. Your money, your rules.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login"
              className="px-10 py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transition-all flex items-center gap-3 text-lg">
              Get Started Free <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-6xl w-full"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-2 cursor-default"
            >
              <div className={`w-16 h-16 ${f.bg} rounded-2xl flex items-center justify-center mb-5`}>
                <f.icon className={`w-8 h-8 ${f.color}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 font-medium flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-primary transition-colors hover:underline">Privacy Policy</Link>
        </div>
        <div>Built with 💚 — FundFlow © {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}
