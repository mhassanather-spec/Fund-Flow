import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: LucideIcon;
  delay?: number;
}

export function MetricCard({ title, value, trend, isPositive, icon: Icon, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 group-hover:border-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <span className={cn(
          "text-sm font-medium px-2 py-1 rounded-full",
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {trend}
        </span>
      </div>
      <div className="relative z-10">
        <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h2>
      </div>
    </motion.div>
  );
}
