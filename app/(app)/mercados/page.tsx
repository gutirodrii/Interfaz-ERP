"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MercadosRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/proyectos");
  }, [router]);

  return null;
}