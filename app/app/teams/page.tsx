"use client";

import { useState } from "react";
import { CreateTeamModal } from "@/components/teams/create-team-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTeamContext } from "@/context/TeamContext";
import { cn } from "@/lib/cn";
import type { TeamRole } from "@/lib/types";

const roleStyles: Record<TeamRole, string> = {
  admin: "border-state-success/30 bg-green-50 text-state-success",
  manager: "border-state-info/30 bg-blue-50 text-state-info",
  member: "border-line bg-[#f3f7fa] text-text-secondary",
  viewer: "border-slate-300 bg-slate-100 text-slate-700"
};

function formatRole(role: TeamRole): string {
  const labels: Record<TeamRole, string> = {
    admin: "Administrador",
    manager: "Gestor",
    member: "Miembro",
    viewer: "Lector"
  };
  return labels[role];
}

function formatMembers(memberCount: number): string {
  return `${memberCount} ${memberCount === 1 ? "miembro" : "miembros"}`;
}

export default function TeamsPage() {
  const { teams, addTeam, setCurrentTeam } = useTeamContext();
  const [createOpen, setCreateOpen] = useState(false);

  function handleCreateTeam(input: { name: string; description: string }) {
    const team = addTeam(input);
    setCurrentTeam(team);
    setCreateOpen(false);
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-heading text-4xl font-semibold text-text-primary">Equipos</h1>
          <p className="text-base text-text-secondary">
            Gestiona propiedad de equipos y visibilidad de roles en todos los modulos del ERP.
          </p>
        </div>

        <Button type="button" className="w-auto px-5" onClick={() => setCreateOpen(true)}>
          + Crear equipo
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="space-y-4 p-6">
            <div className="space-y-2">
              <h2 className="font-heading text-xl font-semibold text-text-primary">{team.name}</h2>
              <p className="text-sm text-text-secondary">{team.description}</p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="text-text-secondary">Rol:</span>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                    roleStyles[team.role]
                  )}
                >
                  {formatRole(team.role)}
                </span>
              </p>
              <p className="text-text-secondary">Miembros: {formatMembers(team.memberCount)}</p>
            </div>

            <Button type="button" variant="secondary" className="w-auto px-5" onClick={() => setCurrentTeam(team)}>
              Ver equipo
            </Button>
          </Card>
        ))}
      </div>

      <CreateTeamModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateTeam}
      />
    </section>
  );
}
