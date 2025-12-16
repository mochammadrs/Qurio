import React from "react";
import { cn } from "@/utils/cn";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

/**
 * Progress Bar Component
 * Visual indicator untuk step progress
 */
export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-ink">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-[#5B8CFF]">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
