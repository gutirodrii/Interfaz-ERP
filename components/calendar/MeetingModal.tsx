"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Meeting } from "@/lib/types";

type MeetingFormValues = {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  scope: "general" | "team";
};

type MeetingModalProps = {
  open: boolean;
  currentTeamName?: string;
  meeting?: Meeting | null;
  initialStart?: Date | null;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    description?: string;
    start: string;
    end: string;
    location?: string;
    scope: "general" | "team";
  }) => void;
  onSave: (
    meetingId: string,
    payload: {
      title: string;
      description?: string;
      start: string;
      end: string;
      location?: string;
      scope: "general" | "team";
    }
  ) => void;
  onDelete: (meetingId: string) => void;
};

const defaultValues: MeetingFormValues = {
  title: "",
  description: "",
  date: "",
  startTime: "10:00",
  endTime: "11:00",
  location: "",
  scope: "team"
};

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTimeInput(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function combineDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

export function MeetingModal({
  open,
  currentTeamName,
  meeting,
  initialStart,
  onClose,
  onCreate,
  onSave,
  onDelete
}: MeetingModalProps) {
  const [form, setForm] = useState<MeetingFormValues>(defaultValues);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const modalTitle = meeting ? "Detalle de reunion" : "Nueva reunion";

  const preparedValues = useMemo(() => {
    if (meeting) {
      const start = new Date(meeting.start);
      const end = new Date(meeting.end);
      return {
        title: meeting.title,
        description: meeting.description ?? "",
        date: formatDateInput(start),
        startTime: formatTimeInput(start),
        endTime: formatTimeInput(end),
        location: meeting.location ?? "",
        scope: meeting.scope
      };
    }

    if (initialStart) {
      const end = new Date(initialStart);
      end.setHours(end.getHours() + 1);
      return {
        ...defaultValues,
        date: formatDateInput(initialStart),
        startTime: formatTimeInput(initialStart),
        endTime: formatTimeInput(end)
      };
    }

    const now = new Date();
    now.setMinutes(0, 0, 0);
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1);

    return {
      ...defaultValues,
      date: formatDateInput(now),
      startTime: formatTimeInput(now),
      endTime: formatTimeInput(nextHour)
    };
  }, [meeting, initialStart]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setForm(preparedValues);
    setTitleError(null);
    setTimeError(null);
    setConfirmDelete(false);
  }, [open, preparedValues]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedTitle = form.title.trim();

    if (!normalizedTitle) {
      setTitleError("El titulo de la reunion es obligatorio.");
      return;
    }

    const start = combineDateTime(form.date, form.startTime);
    const end = combineDateTime(form.date, form.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      setTimeError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    const payload = {
      title: normalizedTitle,
      description: form.description.trim() || undefined,
      start: start.toISOString(),
      end: end.toISOString(),
      location: form.location.trim() || undefined,
      scope: form.scope
    };

    if (meeting) {
      onSave(meeting.id, payload);
    } else {
      onCreate(payload);
    }
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
        className="w-full max-w-2xl rounded-2xl border border-line bg-surface p-6 shadow-lift"
        role="dialog"
        aria-modal="true"
        aria-labelledby="meeting-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="meeting-modal-title" className="font-heading text-2xl font-semibold text-text-primary">
          {modalTitle}
        </h2>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            id="meeting-title"
            label="Titulo"
            value={form.title}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, title: event.target.value }));
              setTitleError(null);
            }}
            error={titleError ?? undefined}
            placeholder="Planificacion de sprint"
          />

          <div className="space-y-1.5">
            <label htmlFor="meeting-description" className="block text-sm font-medium text-text-primary">
              Descripcion
            </label>
            <textarea
              id="meeting-description"
              rows={3}
              value={form.description}
              onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
              className="w-full resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-base text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-primary">Alcance</p>
            <div className="inline-flex rounded-xl border border-line bg-white p-1">
              <button
                type="button"
                onClick={() => setForm((previous) => ({ ...previous, scope: "general" }))}
                className={form.scope === "general"
                  ? "rounded-lg bg-[#e9f0f7] px-3 py-1.5 text-sm font-medium text-brand-primary"
                  : "rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-[#f3f7fa]"}
              >
                General
              </button>
              <button
                type="button"
                onClick={() => setForm((previous) => ({ ...previous, scope: "team" }))}
                className={form.scope === "team"
                  ? "rounded-lg bg-[#e9f0f7] px-3 py-1.5 text-sm font-medium text-brand-primary"
                  : "rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-[#f3f7fa]"}
              >
                Equipo
              </button>
            </div>
            {form.scope === "team" ? (
              <p className="text-sm text-text-secondary">Equipo: {currentTeamName ?? "Equipo actual"}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-1">
              <label htmlFor="meeting-date" className="block text-sm font-medium text-text-primary">
                Fecha
              </label>
              <input
                id="meeting-date"
                type="date"
                value={form.date}
                onChange={(event) => setForm((previous) => ({ ...previous, date: event.target.value }))}
                className="h-11 w-full rounded-xl border border-line bg-white px-3 text-base text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="meeting-start" className="block text-sm font-medium text-text-primary">
                Inicio
              </label>
              <input
                id="meeting-start"
                type="time"
                value={form.startTime}
                onChange={(event) => {
                  setForm((previous) => ({ ...previous, startTime: event.target.value }));
                  setTimeError(null);
                }}
                className="h-11 w-full rounded-xl border border-line bg-white px-3 text-base text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="meeting-end" className="block text-sm font-medium text-text-primary">
                Fin
              </label>
              <input
                id="meeting-end"
                type="time"
                value={form.endTime}
                onChange={(event) => {
                  setForm((previous) => ({ ...previous, endTime: event.target.value }));
                  setTimeError(null);
                }}
                className="h-11 w-full rounded-xl border border-line bg-white px-3 text-base text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
              />
            </div>
          </div>

          {timeError ? <p className="text-sm font-medium text-state-error">{timeError}</p> : null}

          <Input
            id="meeting-location"
            label="Ubicacion"
            value={form.location}
            onChange={(event) => setForm((previous) => ({ ...previous, location: event.target.value }))}
            placeholder="Sala Atlas / enlace de Zoom"
          />

          <div className="flex flex-wrap justify-between gap-2 pt-2">
            {meeting ? (
              <Button
                type="button"
                variant="secondary"
                className="w-auto border-state-error/30 text-state-error hover:bg-red-50"
                onClick={() => setConfirmDelete(true)}
              >
                Eliminar
              </Button>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <Button type="button" variant="secondary" className="w-auto px-5" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="w-auto px-5">
                {meeting ? "Guardar" : "Crear"}
              </Button>
            </div>
          </div>
        </form>

        {confirmDelete && meeting ? (
          <div className="mt-5 rounded-xl border border-state-error/30 bg-red-50 p-4">
            <p className="text-sm font-medium text-state-error">Cancelar esta reunion?</p>
            <div className="mt-3 flex gap-2">
              <Button type="button" variant="secondary" className="w-auto px-4" onClick={() => setConfirmDelete(false)}>
                Mantener
              </Button>
              <Button
                type="button"
                className="w-auto bg-state-error px-4 hover:bg-[#b83a3a] active:bg-[#9f3232]"
                onClick={() => onDelete(meeting.id)}
              >
                Confirmar cancelacion
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
