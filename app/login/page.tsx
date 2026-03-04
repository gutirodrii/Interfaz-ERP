"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { getSession, saveSession, signIn } from "@/lib/auth";

type FieldErrors = {
  email?: string;
  password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFields(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = "Ingresa tu correo.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Usa un correo valido (por ejemplo: nombre@empresa.com).";
  }

  if (!password) {
    errors.password = "Ingresa tu contrasena.";
  } else if (password.length < 8) {
    errors.password = "La contrasena debe tener al menos 8 caracteres.";
  }

  return errors;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4c-1.6-1.5-3.6-2.4-6.2-2.4C6.8 2.7 2.7 6.9 2.7 12s4.1 9.3 9.3 9.3c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1.1-.1-1.6H12z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace("/app");
      return;
    }
    setCheckingSession(false);
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneralError(null);

    const errors = validateFields(email, password);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.success) {
      saveSession(result.session);

      // Placeholder for now. In a real app this can control token lifetime policy.
      if (!rememberMe) {
        window.localStorage.setItem("flowops.session.remembered", "false");
      }

      router.replace("/app");
      return;
    }

    setGeneralError("No se pudo iniciar sesion. Revisa tus credenciales e intentalo de nuevo.");
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-appbg p-4">
        <p className="text-sm text-text-secondary">Verificando sesion...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-appbg p-4 sm:p-6">
      <Card className="w-full max-w-md animate-fade-up p-7 sm:p-8">
        <div className="space-y-6">
          <header className="space-y-2 text-center">
            <p className="font-heading text-3xl font-semibold tracking-tight text-brand-primary">FlowOps</p>
            <h1 className="font-heading text-4xl font-semibold text-text-primary">Inicia sesion en tu espacio</h1>
            <p className="text-base text-text-secondary">Gestiona equipos y tareas en un solo panel claro.</p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {generalError ? (
              <Toast
                title="No fue posible iniciar sesion"
                message={`${generalError} Usa demo@flowops.com / demo1234.`}
                variant="error"
              />
            ) : null}

            <Input
              id="email"
              label="Correo"
              type="email"
              autoComplete="email"
              placeholder="tu@empresa.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={fieldErrors.email}
            />

            <Input
              id="password"
              label="Contrasena"
              type="password"
              autoComplete="current-password"
              placeholder="Escribe tu contrasena"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={fieldErrors.password}
            />

            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-line text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
                />
                <span>Recordarme</span>
              </label>

              <Link
                href="#"
                className="text-sm font-medium text-brand-primary underline-offset-4 transition-colors hover:text-[#1a4268] hover:underline"
              >
                Olvidaste tu contrasena?
              </Link>
            </div>

            <Button type="submit" loading={loading} aria-label="Iniciar sesion en FlowOps">
              Iniciar sesion
            </Button>

            <Divider text="o" />

            <Button type="button" variant="secondary" leftIcon={<GoogleIcon />}>
              Continuar con Google
            </Button>

            <p className="text-center text-xs text-text-secondary">
              Al iniciar sesion aceptas nuestros{" "}
              <Link href="#" className="underline underline-offset-2 hover:text-text-primary">
                Terminos
              </Link>{" "}
              y la{" "}
              <Link href="#" className="underline underline-offset-2 hover:text-text-primary">
                Politica de privacidad
              </Link>
              .
            </p>
          </form>
        </div>
      </Card>
    </main>
  );
}
