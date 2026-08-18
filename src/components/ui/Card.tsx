import React from "react";
import { cn } from "@/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = false, className, ...props }: CardProps) {
  const baseStyles = "bg-surface-card border border-border rounded-lg p-6";
  const hoverStyles = hover
    ? "transition-colors duration-150 cursor-pointer hover:bg-surface-low"
    : "";

  return (
    <div
      className={cn(baseStyles, hoverStyles, className)}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      role={props.role}
      aria-label={props["aria-label"]}
    >
      {children}
    </div>
  );
}
