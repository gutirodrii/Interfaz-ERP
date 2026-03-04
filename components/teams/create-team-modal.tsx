"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CreateTeamModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (input: { name: string; description: string }) => void;
};

export function CreateTeamModal({ open, onClose, onCreate }: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTeamName("");
      setDescription("");
      setNameError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = teamName.trim();

    if (normalizedName.length < 2) {
      setNameError("El nombre del equipo debe tener al menos 2 caracteres.");
      return;
    }

    onCreate({
      name: normalizedName,
      description
    });
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2933]/35 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-lift"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-team-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 space-y-1">
          <h2 id="create-team-title" className="font-heading text-2xl font-semibold text-text-primary">
            Crear equipo
          </h2>
          <p className="text-base text-text-secondary">
            Crea un nuevo espacio de equipo. La integracion con backend se conectara despues.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            id="team-name"
            label="Nombre del equipo"
            placeholder="Ejemplo: Equipo de Operaciones"
            value={teamName}
            onChange={(event) => {
              setTeamName(event.target.value);
              setNameError(null);
            }}
            error={nameError ?? undefined}
          />

          <div className="space-y-1.5">
            <label htmlFor="team-description" className="block text-sm font-medium text-text-primary">
              Descripcion
            </label>
            <textarea
              id="team-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="De que se encarga este equipo?"
              className="w-full resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-base text-text-primary shadow-sm transition-colors placeholder:text-text-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" className="w-auto px-5" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="w-auto px-5">
              Crear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
