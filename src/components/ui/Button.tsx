import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

/**
 * Bouncy Button Component - MVP Bento Style
 * Tombol dengan animasi membal saat diklik & playful hover
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const { playClickSound } = useSoundEffects();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickSound();
    if (props.onClick) {
      props.onClick(e);
    }
  };
  const baseStyles =
    "font-bold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer";

  const variants = {
    primary: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-blue-300/50 hover:shadow-blue-400/60",
    secondary: "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 border-2 border-gray-300",
    success: "bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-300/50 hover:shadow-green-400/60",
    danger: "bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-300/50 hover:shadow-red-400/60",
  };

  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-10 py-5 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={props.disabled}
      onClick={handleClick}
      type={props.type}
      form={props.form}
      name={props.name}
      value={props.value}
      aria-label={props["aria-label"]}
    >
      {children}
    </motion.button>
  );
}
