"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { TeamProvider } from "@/context/TeamContext";
import { WorkProvider } from "@/context/WorkContext";
import { clearSession, getSession, type MockSession } from "@/lib/auth";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<MockSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.replace("/login");
      return;
    }
    setSession(currentSession);
    setReady(true);
  }, [router]);

  function handleSignOut() {
    clearSession();
    router.replace("/login");
  }

  if (!ready || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-appbg p-4">
        <p className="text-sm text-text-secondary">Preparando espacio de trabajo...</p>
      </main>
    );
  }

  return (
    <TeamProvider>
      <WorkProvider>
        <AppShell session={session} onSignOut={handleSignOut}>
          {children}
        </AppShell>
      </WorkProvider>
    </TeamProvider>
  );
}

function AppShell({
  children,
  session,
  onSignOut
}: {
  children: ReactNode;
  session: MockSession;
  onSignOut: () => void;
}) {
  return (
    <div className="min-h-screen bg-appbg">
      <LeftSidebar session={session} onSignOut={onSignOut} />

      <main className="pb-8 md:pl-[260px]">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
