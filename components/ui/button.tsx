import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  leftIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white hover:bg-[#1a4268] active:bg-[#163955] border border-transparent shadow-sm",
  secondary:
    "bg-surface text-text-primary border border-line hover:bg-[#f4f8fb] active:bg-[#eaf1f7] shadow-sm",
  ghost: "bg-transparent text-text-secondary border border-transparent hover:bg-[#eef4f8]"
};

export function Button({
  className,
  children,
  variant = "primary",
  loading = false,
  disabled,
  leftIcon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
        variantClasses[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
          <span>Iniciando sesion...</span>
        </span>
      ) : (
        <>
          {leftIcon ? <span aria-hidden="true">{leftIcon}</span> : null}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
