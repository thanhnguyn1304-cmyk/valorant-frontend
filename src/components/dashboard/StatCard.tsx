import React from "react";

// 1. Defining the "Props" (The inputs this component accepts)
interface StatCardProps {
  title: string;
  value: string;
  subtext?: string; // Optional text like "Top 4%"
  isGood: boolean; // Decides if we color it green or red
}

// 2. The Component Function
const StatCard = ({ title, value, subtext, isGood }: StatCardProps) => {
  return (
    // Container: Dark background, rounded corners, p-4 padding
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
      {/* Title: Small, gray text */}
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
        {title}
      </h3>

      {/* Value: Big, bold white text */}
      <div className="mt-2 text-3xl font-bold text-white">{value}</div>

      {/* Subtext / Indicator Bar */}
      <div className="mt-2 flex items-center">
        {/* The Colored Dot */}
        <span
          className={`h-2.5 w-2.5 rounded-full mr-2 ${
            isGood ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span
          className={`text-sm ${isGood ? "text-green-400" : "text-red-400"}`}
        >
          {subtext || (isGood ? "Excellent" : "Needs Work")}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
