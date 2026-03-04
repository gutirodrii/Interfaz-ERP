"use client";

import { useEffect, useRef, useState } from "react";
import { useTeamContext } from "@/context/TeamContext";
import { cn } from "@/lib/cn";

type TeamSelectorProps = {
  onCreateTeam: () => void;
};

export function TeamSelector({ onCreateTeam }: TeamSelectorProps) {
  const { teams, currentTeam, setCurrentTeam } = useTeamContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-base font-medium text-text-primary shadow-sm transition-colors hover:bg-[#f4f8fb]"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span className="hidden sm:inline">Equipo:</span>
        <span>{currentTeam?.name ?? "Seleccionar equipo"}</span>
        <span className="text-text-secondary" aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <div
          className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-64 rounded-xl border border-line bg-surface p-2 shadow-sm"
          role="menu"
          aria-label="Selector de equipo"
        >
          <div className="space-y-1">
            {teams.map((team) => {
              const selected = currentTeam?.id === team.id;
              return (
                <button
                  key={team.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    selected
                      ? "bg-[#e9f0f7] text-brand-primary"
                      : "text-text-primary hover:bg-[#f3f7fa] hover:text-text-primary"
                  )}
                  onClick={() => {
                    setCurrentTeam(team);
                    setOpen(false);
                  }}
                  role="menuitem"
                >
                  <span>{team.name}</span>
                  {selected ? <span aria-hidden="true">✓</span> : null}
                </button>
              );
            })}
          </div>

          <div className="my-2 h-px bg-line" />

          <button
            type="button"
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-brand-primary transition-colors hover:bg-[#f3f7fa]"
            onClick={() => {
              setOpen(false);
              onCreateTeam();
            }}
            role="menuitem"
          >
            + Crear equipo
          </button>
        </div>
      ) : null}
    </div>
  );
}
