import type { Meeting } from "@/lib/types";

export const mockMeetingsByTeam: Record<string, Meeting[]> = {
  general: [
    {
      id: "meeting-g1",
      scope: "general",
      teamId: null,
      title: "Reunion general",
      description: "Actualizacion mensual del espacio de trabajo para todos los equipos.",
      start: "2026-03-10T09:00:00.000Z",
      end: "2026-03-10T10:00:00.000Z",
      location: "Auditorio principal",
      createdById: "user-1",
      createdAt: "2026-03-04T07:45:00.000Z"
    }
  ],
  "team-1": [
    {
      id: "meeting-1",
      scope: "team",
      teamId: "team-1",
      title: "Planificacion de sprint",
      description: "Planificar tareas y dependencias del proximo sprint.",
      start: "2026-03-06T10:00:00.000Z",
      end: "2026-03-06T11:00:00.000Z",
      location: "Sala Atlas",
      createdById: "user-1",
      createdAt: "2026-03-04T08:00:00.000Z"
    },
    {
      id: "meeting-2",
      scope: "team",
      teamId: "team-1",
      title: "Revision de contrato API",
      start: "2026-03-08T13:00:00.000Z",
      end: "2026-03-08T14:00:00.000Z",
      location: "Zoom",
      createdById: "user-2",
      createdAt: "2026-03-04T08:20:00.000Z"
    }
  ],
  "team-2": [
    {
      id: "meeting-3",
      scope: "team",
      teamId: "team-2",
      title: "Inicio de campana",
      start: "2026-03-07T09:30:00.000Z",
      end: "2026-03-07T10:30:00.000Z",
      location: "Sala Nova",
      createdById: "user-5",
      createdAt: "2026-03-04T08:45:00.000Z"
    }
  ],
  "team-3": [
    {
      id: "meeting-4",
      scope: "team",
      teamId: "team-3",
      title: "Critica de diseno",
      start: "2026-03-09T15:00:00.000Z",
      end: "2026-03-09T16:00:00.000Z",
      location: "Figma Huddle",
      createdById: "user-8",
      createdAt: "2026-03-04T09:05:00.000Z"
    }
  ]
};
