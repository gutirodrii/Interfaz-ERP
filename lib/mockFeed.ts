import type { FeedPost } from "@/lib/types";

export const mockFeedPosts: FeedPost[] = [
  {
    id: "post-1",
    kind: "post",
    author: "Ana Torres",
    role: "Gerente",
    content: "Planificacion de sprint manana a las 10:00. Actualiza tus bloqueos antes de fin del dia.",
    timestamp: "hace 10 min",
    createdAt: "2026-03-04T09:50:00.000Z",
    teamId: "team-1",
    scope: "general",
    likes: 6,
    comments: 2
  },
  {
    id: "post-2",
    kind: "post",
    author: "Leo Martin",
    role: "Responsable de producto",
    content: "Revision de API completada. Los endpoints de integracion ya estan aprobados para el proximo ciclo.",
    timestamp: "hace 35 min",
    createdAt: "2026-03-04T09:25:00.000Z",
    teamId: "team-1",
    scope: "teams",
    likes: 9,
    comments: 4
  },
  {
    id: "post-3",
    kind: "post",
    author: "Sofia Ruiz",
    role: "Disenadora",
    content: "QA de diseno aprobado para el flujo de onboarding. Los tokens finales ya estan sincronizados.",
    timestamp: "hace 1 h",
    createdAt: "2026-03-04T09:00:00.000Z",
    teamId: "team-3",
    scope: "general",
    likes: 11,
    comments: 5
  },
  {
    id: "post-4",
    kind: "post",
    author: "Carlos Vega",
    role: "Ingeniero",
    content: "Tarea completada: migramos el panel de notificaciones y reducimos el tiempo de render en 18%.",
    timestamp: "hace 2 h",
    createdAt: "2026-03-04T08:00:00.000Z",
    teamId: "team-2",
    scope: "teams",
    likes: 7,
    comments: 3
  },
  {
    id: "post-5",
    kind: "post",
    author: "Marta Gil",
    role: "Coordinadora",
    content: "Demo con cliente confirmada para el viernes. Comparto borrador de agenda en el canal de documentos.",
    timestamp: "hace 3 h",
    createdAt: "2026-03-04T07:00:00.000Z",
    teamId: "team-1",
    scope: "general",
    likes: 4,
    comments: 1
  }
];
