import { Target, BarChart3, Wallet, Brain, TrendingUp, Sparkles } from "lucide-react";
import { PublicNav } from "../components/layout/PublicNav";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function WhyTracking() {
  const reasons = [
    { 
      icon: Target, 
      color: "text-rose-500", bg: "bg-rose-50",
      title: "Goal Achievement", 
      desc: "Without tracking, savings are just a guess. Knowing exactly where your money goes allows you to redirect funds to what truly matters."
    },
    { 
      icon: BarChart3, 
      color: "text-amber-500", bg: "bg-amber-50",
      title: "Financial Awareness", 
      desc: "Small, daily expenses add up faster than you think. Tracking brings hidden spending habits to light so you can curb them."
    },
    { 
      icon: Wallet, 
      color: "text-emerald-500", bg: "bg-emerald-50",
      title: "Peace of Mind", 
      desc: "Financial stress is real. Having a clear budget and knowing you're living within your means provides incredible mental clarity."
    },
    { 
      icon: Brain, 
      color: "text-blue-500", bg: "bg-blue-50",
      title: "Behavioral Change", 
      desc: "The simple act of recording an expense makes you think twice before you spend. Tracking actively builds better financial habits."
    },
    { 
      icon: TrendingUp, 
      color: "text-purple-500", bg: "bg-purple-50",
      title: "Wealth Building", 
      desc: "You can't manage what you don't measure. Tracking is the foundational step to investing and long-term wealth accumulation."
    },
    { 
      icon: Sparkles, 
      color: "text-orange-500", bg: "bg-orange-50",
      title: "Financial Freedom", 
      desc: "Ultimately, tracking gives you the control needed to reach financial independence, giving you choices rather than obligations."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Why tracking your money is <span className="text-primary italic">crucial</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed">
            Financial success isn't about making millions—it's about knowing exactly where every dollar goes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left mt-12 mb-20">
          {reasons.map((r, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className={`w-16 h-16 ${r.bg} ${r.color} rounded-2xl flex items-center justify-center mb-6`}>
                <r.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{r.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-primary/5 rounded-[3rem] p-12 text-center border border-primary/10 max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to take control?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have already optimized their spending habits with FundFlow.
          </p>
          <Link to="/login" className="inline-block px-10 py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transition-all text-lg">
            Start Tracking Free
          </Link>
        </motion.div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-400 font-medium border-t border-gray-200 bg-white flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-primary transition-colors hover:underline">Privacy Policy</Link>
        </div>
        <div>Built with 💚 — FundFlow © {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}
