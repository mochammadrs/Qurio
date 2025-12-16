import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

/**
 * Card Component - MVP Bento Style
 * Container dengan rounded corners besar dan shadow-soft untuk aesthetic playful
 */
export function Card({ children, hover = false, className, ...props }: CardProps) {
  const baseStyles = "bg-card-white rounded-2xl shadow-soft p-8 border border-gray-100";
  const hoverStyles = hover 
    ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-blue/20 cursor-pointer" 
    : "";

  if (hover) {
    return (
      <motion.div 
        className={cn(baseStyles, hoverStyles, className)} 
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        role={props.role}
        aria-label={props["aria-label"]}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(baseStyles, className)} {...props}>
      {children}
    </div>
  );
}
