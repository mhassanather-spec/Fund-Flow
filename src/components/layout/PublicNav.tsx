import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export function PublicNav() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto w-full sticky top-0 z-50 bg-[#f0f4ff]/80 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-3 group relative">
        {/* Custom user logo */}
        <img 
          src="/logo.png" 
          alt="FundFlow Logo" 
          className="h-14 object-contain" 
          id="custom-logo"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = document.getElementById('fallback-logo');
            if (fallback) fallback.classList.remove('hidden');
          }} 
        />
        
        {/* Fallback if image not found */}
        <div id="fallback-logo" className="hidden flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#174885] to-primary flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-gray-900 line-through decoration-transparent">
            <span className="text-[#174885]">Fund</span><span className="text-primary">Flow</span>
          </span>
        </div>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
        <Link to="/about" className="hover:text-primary transition-colors">About</Link>
        <Link to="/why-important" className="hover:text-primary transition-colors">Why It's Important</Link>
      </div>

      <Link to="/login"
        className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl transition-all shadow-sm">
        Sign In
      </Link>
    </nav>
  );
}
