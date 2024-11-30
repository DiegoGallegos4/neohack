import { BarChart2, DollarSign, TrendingUp } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: "chart-bar" | "dollar-sign" | "trending-up";
}

const iconMap = {
  "chart-bar": BarChart2,
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
};

export function StatsCard({ title, value, icon }: StatsCardProps) {
  const Icon = iconMap[icon];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className="bg-primary text-primary-foreground p-3 rounded-full mr-4">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
