import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Target,
  ShieldCheck
} from "lucide-react";
import { cn } from "../../utils/cn";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/expenses", icon: Receipt },
  { name: "Budgets", href: "/budgets", icon: Wallet },
  { name: "Planner", href: "/planner", icon: Target },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-100 z-10 shadow-sm">
      <div className="flex h-16 items-center px-6 border-b border-gray-50 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#174885] to-primary flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#174885]">Fund</span><span className="text-primary">Flow</span>
          </span>
        </div>
      </div>
      <nav className="flex-1 space-y-2 px-4 py-8">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform duration-300", isActive ? "text-primary scale-110" : "text-gray-400 group-hover:scale-110")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
