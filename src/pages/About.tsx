import { ShieldCheck, Users, Globe, Lock } from "lucide-react";
import { PublicNav } from "../components/layout/PublicNav";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#e8f5e9] flex flex-col">
      <PublicNav />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
            About <span className="text-primary">FundFlow</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize financial well-being by providing everyone with beautiful, intuitive, and secure tools to manage their money.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-lg text-gray-600 leading-relaxed"
          >
            <p>
              FundFlow was built out of frustration with existing financial trackers. They were either too complex, requiring a degree in accounting to use, or too simple, lacking the tools needed to truly take control of your financial life.
            </p>
            <p>
              We believe that managing your money should feel empowering, not like a chore. That's why we built FundFlow around the principles of beautiful design, frictionless data entry, and actionable insights.
            </p>
            <p>
              Whether you're tracking daily coffee runs, setting strict budgets to save for a down payment, or monitoring your overall cash flow, FundFlow gives you the complete picture in real-time.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 flex flex-col items-center justify-center aspect-square relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5" />
            <ShieldCheck className="w-32 h-32 text-primary relative z-10" />
            <h3 className="text-2xl font-bold text-gray-900 mt-8 relative z-10">Secure by Design</h3>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">User-Centric</h3>
            <p className="text-gray-500">Every feature is designed with the end-user in mind. We prioritize ease of use over unnecessary complexity.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy First</h3>
            <p className="text-gray-500">Your financial data is your business. We utilize enterprise-grade security to ensure your data is always safe.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Support</h3>
            <p className="text-gray-500">With support for international currencies, FundFlow works beautifully no matter where you are in the world.</p>
          </div>
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
