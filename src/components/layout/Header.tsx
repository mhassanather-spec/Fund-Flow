import { Bell, Search, User, CheckCircle2, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Header() {
  const { user, signOut } = useAuth();
  
  const userName = user?.user_metadata?.name || "Guest";
  const shortName = userName.split(" ")[0];
  const country = user?.user_metadata?.country || "USD";

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm flex-shrink-0">
      <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-96 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Search className="w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search activity..." 
          className="bg-transparent border-none outline-none text-sm text-gray-900 w-full placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-5 ml-auto">
        <button className="relative p-2 rounded-full hover:bg-gray-50 transition-colors group">
          <Bell className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
        </button>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex items-center gap-3 p-1.5 pr-4 rounded-full">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gray-900 leading-none">{shortName}</span>
              <CheckCircle2 className="w-3 h-3 text-primary" />
            </div>
            <span className="text-xs text-gray-500 mt-1 leading-none font-medium">
              {country}
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 transition-colors group" title="Sign Out">
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
        </button>
      </div>
    </header>
  );
}
