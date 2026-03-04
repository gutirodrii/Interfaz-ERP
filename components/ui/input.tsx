import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  mono?: boolean;
};

export function Input({ id, label, error, hint, className, mono = false, ...props }: InputProps) {
  const hintId = hint && id ? `${id}-hint` : undefined;
  const errorId = error && id ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-11 w-full rounded-xl border px-3 text-base text-text-primary shadow-sm transition-colors placeholder:text-text-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2",
          mono ? "font-mono" : "font-sans",
          error ? "border-state-error bg-red-50/40" : "border-line bg-white",
          className
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm font-medium text-state-error">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-text-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
