import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: [
        "bg-[#3B82F6] text-white",
        "border border-white/15",
        "shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]",
        "hover:bg-[#2563EB] hover:shadow-[0_4px_16px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]",
        "hover:-translate-y-[0.5px]",
        "active:translate-y-0 active:shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
      ].join(" "),
      secondary: [
        "bg-[#8B5CF6] text-white",
        "border border-white/15",
        "shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
        "hover:bg-[#7C3AED] hover:shadow-[0_4px_16px_rgba(139,92,246,0.3)]",
        "hover:-translate-y-[0.5px]",
        "active:translate-y-0",
      ].join(" "),
      outline: [
        "bg-transparent text-white/70",
        "border border-white/[0.09]",
        "hover:bg-white/[0.05] hover:text-white/90 hover:border-white/[0.14]",
      ].join(" "),
      ghost: [
        "bg-transparent text-white/50",
        "border border-transparent",
        "hover:bg-white/[0.05] hover:text-white/80",
      ].join(" "),
      destructive: [
        "bg-[#EF4444] text-white",
        "border border-white/10",
        "shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
        "hover:bg-[#DC2626] hover:shadow-[0_4px_16px_rgba(239,68,68,0.3)]",
        "hover:-translate-y-[0.5px]",
      ].join(" "),
    };

    const sizes = {
      sm: "h-8 px-3.5 text-[12px]",
      md: "h-[38px] px-5 text-[13px]",
      lg: "h-11 px-6 text-[14px]",
      icon: "h-[38px] w-[38px] flex items-center justify-center p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 ease-out",
          "disabled:opacity-40 disabled:pointer-events-none disabled:transform-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
