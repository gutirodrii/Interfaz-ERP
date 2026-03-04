import { clearStoredSession, getStoredSession, saveStoredSession } from "@/lib/storage";

export type MockSession = {
  user: {
    email: string;
    name: string;
  };
  token: string;
};

type SignInResult =
  | {
      success: true;
      session: MockSession;
    }
  | {
      success: false;
      error: string;
    };

const DEMO_EMAIL = "demo@flowops.com";
const DEMO_PASSWORD = "demo1234";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
  await wait(850);

  // TODO: Replace this mock check with a real API call to the backend auth endpoint.
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return {
      success: true,
      session: {
        user: {
          email,
          name: "Usuario Demo"
        },
        token: "mock"
      }
    };
  }

  return {
    success: false,
    error: "Correo o contrasena invalidos."
  };
}

export function saveSession(session: MockSession): void {
  saveStoredSession<MockSession>(session);
}

export function getSession(): MockSession | null {
  return getStoredSession<MockSession>();
}

export function clearSession(): void {
  clearStoredSession();
}
