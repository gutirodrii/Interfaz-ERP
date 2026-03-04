import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type KanbanColumnProps = {
  title: string;
  count: number;
  onAdd: () => void;
  children: ReactNode;
};

export function KanbanColumn({ title, count, onAdd, children }: KanbanColumnProps) {
  return (
    <section className="rounded-xl border border-line bg-surface p-6 shadow-sm">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-xl font-semibold text-text-primary">{title}</h2>
          <span className="rounded-full bg-[#eef4f8] px-2 py-0.5 text-sm font-semibold text-text-secondary">
            {count}
          </span>
        </div>
        <Button type="button" variant="ghost" className="w-auto px-2.5 py-1 text-sm" onClick={onAdd}>
          + Agregar
        </Button>
      </header>

      <div className="space-y-3">{children}</div>
    </section>
  );
}
