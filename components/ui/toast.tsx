import { cn } from "@/lib/cn";

type ToastVariant = "success" | "warning" | "error" | "info";

type ToastProps = {
  title: string;
  message: string;
  variant?: ToastVariant;
};

const variantStyles: Record<ToastVariant, string> = {
  success: "border-state-success bg-green-50 text-state-success",
  warning: "border-state-warning bg-orange-50 text-state-warning",
  error: "border-state-error bg-red-50 text-state-error",
  info: "border-state-info bg-blue-50 text-state-info"
};

export function Toast({ title, message, variant = "error" }: ToastProps) {
  return (
    <div
      className={cn("rounded-xl border px-4 py-3", variantStyles[variant])}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}
