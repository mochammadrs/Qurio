import React from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark border border-transparent",
    secondary: "bg-transparent text-primary border border-border hover:border-text-subtle",
    ghost: "bg-transparent text-primary hover:bg-surface-container",
    danger: "bg-error text-white hover:bg-error-dark border border-transparent",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={props.disabled}
      onClick={props.onClick}
      type={props.type}
      form={props.form}
      name={props.name}
      value={props.value}
      aria-label={props["aria-label"]}
    >
      {children}
    </button>
  );
}
