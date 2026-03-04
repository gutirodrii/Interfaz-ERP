"use client";

import { Card } from "@/components/ui/card";
import { useTeamContext } from "@/context/TeamContext";
import { useWorkContext } from "@/context/WorkContext";

const upcomingMeetings = [
  "Planificacion de sprint",
  "Sincronizacion de equipo",
  "Demo con cliente"
];

export function RightPanel() {
  const { teams, currentTeam } = useTeamContext();
  const { tasksByTeam } = useWorkContext();

  const teamTasks = currentTeam ? tasksByTeam[currentTeam.id] ?? [] : [];
  const upcomingTasks = teamTasks
    .filter((task) => task.dueDate && task.status !== "done")
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) {
        return 0;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 3);

  return (
    <aside className="space-y-6 xl:sticky xl:top-6">
      <Card className="p-6">
        <label htmlFor="workspace-search" className="sr-only">
          Buscar en el espacio de trabajo
        </label>
        <input
          id="workspace-search"
          type="search"
          placeholder="Buscar..."
          className="h-11 w-full rounded-xl border border-line bg-white px-3 text-base text-text-primary shadow-sm placeholder:text-text-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
        />
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-heading text-xl font-semibold text-text-primary">Proximas tareas</h2>
        <ul className="space-y-2 text-base text-text-secondary">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task) => (
              <li key={task.id} className="rounded-lg bg-[#f7fafc] px-3 py-2">
                <p className="font-medium text-text-primary">{task.title}</p>
                <p className="text-sm text-text-secondary">Vence: {task.dueDate}</p>
              </li>
            ))
          ) : (
            <li className="rounded-lg bg-[#f7fafc] px-3 py-2">No hay tareas proximas.</li>
          )}
        </ul>
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-heading text-xl font-semibold text-text-primary">Equipos a los que perteneces</h2>
        <ul className="space-y-2 text-base text-text-secondary">
          {teams.map((team) => (
            <li key={team.id} className="rounded-lg bg-[#f7fafc] px-3 py-2">
              {team.name}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-heading text-xl font-semibold text-text-primary">Proximas reuniones</h2>
        <ul className="space-y-2 text-base text-text-secondary">
          {upcomingMeetings.map((meeting) => (
            <li key={meeting} className="rounded-lg bg-[#f7fafc] px-3 py-2">
              {meeting}
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
}
