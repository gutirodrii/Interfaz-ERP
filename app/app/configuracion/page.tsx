"use client";

import { Wrench } from "lucide-react";

export default function ConfiguracionPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-heading text-4xl font-semibold text-text-primary">Configuracion</h1>
        <p className="text-base text-text-secondary">Modulo temporalmente deshabilitado.</p>
      </header>

      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Wrench size={24} />
        </div>
        <p className="text-lg font-semibold text-text-primary">En mantenimiento</p>
        <p className="max-w-xl text-sm text-text-secondary">
          Esta ventana se encuentra en mantenimiento. Vuelve a intentarlo mas tarde.
        </p>
      </div>
    </section>
  );
}