import { motion } from "framer-motion";

interface GoalProgressProps {
  title: string;
  target: number;
  current: number;
  colorClass: string;
}

export function GoalProgress({ title, target, current, colorClass }: GoalProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
      <div className="relative w-20 h-20 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-gray-100"
            strokeWidth="6"
            fill="transparent"
          />
          {/* Progress Ring with animation */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="40"
            cy="40"
            r={radius}
            className={colorClass}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-1">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">
            ${current.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">/ ${target.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
