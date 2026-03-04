import type { User } from "@/lib/types";

export const mockUsersByTeam: Record<string, User[]> = {
  "team-1": [
    {
      id: "user-1",
      teamId: "team-1",
      name: "Ana Torres",
      initials: "AT",
      email: "ana@flowops.com",
      role: "Gerente"
    },
    {
      id: "user-2",
      teamId: "team-1",
      name: "Leo Martin",
      initials: "LM",
      email: "leo@flowops.com",
      role: "Responsable de producto"
    },
    {
      id: "user-3",
      teamId: "team-1",
      name: "Nora Diaz",
      initials: "ND",
      email: "nora@flowops.com",
      role: "Ingeniera"
    },
    {
      id: "user-4",
      teamId: "team-1",
      name: "Pablo Cruz",
      initials: "PC",
      email: "pablo@flowops.com",
      role: "QA"
    }
  ],
  "team-2": [
    {
      id: "user-5",
      teamId: "team-2",
      name: "Marta Gil",
      initials: "MG",
      email: "marta@flowops.com",
      role: "Coordinadora"
    },
    {
      id: "user-6",
      teamId: "team-2",
      name: "Carlos Vega",
      initials: "CV",
      email: "carlos@flowops.com",
      role: "Ingeniero"
    },
    {
      id: "user-7",
      teamId: "team-2",
      name: "Sara Lopez",
      initials: "SL",
      email: "sara@flowops.com",
      role: "Analista"
    }
  ],
  "team-3": [
    {
      id: "user-8",
      teamId: "team-3",
      name: "Sofia Ruiz",
      initials: "SR",
      email: "sofia@flowops.com",
      role: "Disenadora"
    },
    {
      id: "user-9",
      teamId: "team-3",
      name: "Daniel Mora",
      initials: "DM",
      email: "daniel@flowops.com",
      role: "Investigador UX"
    },
    {
      id: "user-10",
      teamId: "team-3",
      name: "Lina Perez",
      initials: "LP",
      email: "lina@flowops.com",
      role: "Operaciones de diseno"
    }
  ]
};
