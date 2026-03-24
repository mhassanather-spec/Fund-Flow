import { motion } from "framer-motion";
import { useState } from "react";
import { ShieldCheck, ArrowRight, Mail, Lock, UserPlus, LogIn, KeyRound, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import { CURRENCIES } from "../data/currencies";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const filtered = CURRENCIES.filter(c =>
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (mode === "forgot") {
      if (!email.trim()) { setError("Please enter your email"); setLoading(false); return; }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage("Password reset link sent! Check your email inbox.");
      }
    } else if (mode === "signup") {
      if (!name.trim()) { setError("Please enter your name"); setLoading(false); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return; }
      const curr = CURRENCIES.find(c => c.code === selectedCurrency)!;
      const result = await signUp(email, password, name, curr.symbol, curr.code);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage("Account created! Check your email to confirm, or sign in if auto-confirmed.");
      }
    } else {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
      >
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#174885] to-primary flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-1 tracking-tight">
          {mode === "forgot" ? "Reset your password" : mode === "signup" ? "Create your " : "Sign in to "}
          {mode !== "forgot" && <><span className="text-[#174885]">Fund</span><span className="text-primary">Flow</span></>}
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          {mode === "forgot" ? "Enter your email and we'll send you a reset link." : mode === "signup" ? "Set up your profile to start tracking." : "Welcome back! Enter your credentials."}
        </p>

        {/* Mode Toggle */}
        {mode !== "forgot" ? (
          <div className="grid grid-cols-2 gap-0 bg-gray-100 rounded-xl p-1 mb-6">
            <button type="button" onClick={() => { setMode("signin"); setError(""); setSuccessMessage(""); }}
              className={`py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                mode === "signin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}>
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button type="button" onClick={() => { setMode("signup"); setError(""); setSuccessMessage(""); }}
              className={`py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                mode === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}>
              <UserPlus className="w-4 h-4" /> Sign Up
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <button type="button" onClick={() => { setMode("signin"); setError(""); setSuccessMessage(""); }}
              className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
              <ArrowRight className="w-3 h-3 rotate-180" /> Back to Sign In
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className={`grid gap-4 ${mode === "signup" ? "grid-cols-2" : "grid-cols-1"}`}>
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">Display Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah Connor"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400 font-medium" />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                <Mail className="w-3 h-3 inline mr-1" />Email Address
              </label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sarah@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400 font-medium" />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                <Lock className="w-3 h-3 inline mr-1" />Password
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "signup" ? "Min 6 characters" : "Enter your password"}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400 font-medium" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">Country & Currency</label>
              
              {/* Selected currency badge */}
              {(() => {
                const sel = CURRENCIES.find(c => c.code === selectedCurrency);
                return sel ? (
                  <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 mb-2">
                    <span className="text-lg">{sel.flag}</span>
                    <span className="font-bold text-gray-900 text-sm">{sel.country}</span>
                    <span className="text-gray-500 text-sm">—</span>
                    <span className="text-sm text-gray-600 font-medium">{sel.name} ({sel.symbol})</span>
                    <span className="ml-auto text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{sel.code}</span>
                  </div>
                ) : null;
              })()}

              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by country, currency name, or code..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400 font-medium mb-2" />
              
              {/* Table header */}
              <div className="grid grid-cols-[2rem_1fr_1fr_5rem] gap-2 px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <span></span>
                <span>Country</span>
                <span>Currency</span>
                <span className="text-right">Code</span>
              </div>
              
              {/* Scrollable list */}
              <div className="max-h-48 overflow-y-auto rounded-b-xl border border-t-0 border-gray-200 bg-gray-50">
                {filtered.map(c => (
                  <button type="button" key={c.code}
                    onClick={() => { setSelectedCurrency(c.code); setSearch(""); }}
                    className={`w-full grid grid-cols-[2rem_1fr_1fr_5rem] gap-2 items-center px-4 py-2.5 text-left text-sm hover:bg-primary/5 transition-colors border-b border-gray-100 last:border-0 ${
                      selectedCurrency === c.code ? 'bg-primary/10 font-bold text-primary' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="truncate font-medium">{c.country}</span>
                    <span className="truncate text-gray-500">{c.name}</span>
                    <span className="text-right font-mono text-xs text-gray-400">{c.symbol}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-400">No matching currency found.</div>
                )}
              </div>
            </div>
          )}
          
          <button type="submit" disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {mode === "forgot" ? (<><KeyRound className="w-5 h-5" /> Send Reset Link</>) : mode === "signup" ? "Create Account" : "Sign In"}
                {mode !== "forgot" && <ArrowRight className="w-5 h-5" />}
              </>
            )}
          </button>

          {mode === "signin" && (
            <button type="button" onClick={() => { setMode("forgot"); setError(""); setSuccessMessage(""); }}
              className="w-full text-center text-sm text-gray-500 hover:text-primary font-medium mt-2 transition-colors">
              Forgot your password?
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
