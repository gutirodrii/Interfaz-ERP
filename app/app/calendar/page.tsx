"use client";

import { endOfWeek, format, getDay, parse, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import dynamic from "next/dynamic";
import { type ComponentType, useMemo, useState } from "react";
import { dateFnsLocalizer, type SlotInfo, type View, Views } from "react-big-calendar";
import { MeetingModal } from "@/components/calendar/MeetingModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTeamContext } from "@/context/TeamContext";
import { useWorkContext } from "@/context/WorkContext";
import { cn } from "@/lib/cn";
import type { Meeting } from "@/lib/types";
import "react-big-calendar/lib/css/react-big-calendar.css";

const Calendar = dynamic(
  () => import("react-big-calendar").then((module) => module.Calendar),
  { ssr: false }
);
const CalendarComponent = Calendar as unknown as ComponentType<Record<string, unknown>>;

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    es
  }
});

type CalendarEvent = {
  id: string;
  title: string;
  scope: Meeting["scope"];
  start: Date;
  end: Date;
  resource: Meeting;
};

const VIEW_OPTIONS: View[] = [Views.MONTH, Views.WEEK, Views.DAY];

function formatViewLabel(view: View): string {
  if (view === Views.MONTH) return "Mes";
  if (view === Views.WEEK) return "Semana";
  return "Dia";
}

function formatHeaderDate(date: Date, view: View): string {
  if (view === Views.WEEK) {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return `${format(start, "d MMM", { locale: es })} - ${format(end, "d MMM yyyy", { locale: es })}`;
  }
  if (view === Views.DAY) {
    return format(date, "EEEE, d MMMM yyyy", { locale: es });
  }
  return format(date, "MMMM yyyy", { locale: es });
}

export default function CalendarPage() {
  const { currentTeam } = useTeamContext();
  const { meetingsByTeam, getMeetingsForTeam, createMeeting, updateMeeting, deleteMeeting } = useWorkContext();

  const [calendarView, setCalendarView] = useState<View>(Views.MONTH);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [slotStart, setSlotStart] = useState<Date | null>(null);

  const visibleMeetings = currentTeam ? getMeetingsForTeam(currentTeam.id) : meetingsByTeam.general ?? [];

  const events: CalendarEvent[] = useMemo(() => {
    return visibleMeetings.map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
      scope: meeting.scope,
      start: new Date(meeting.start),
      end: new Date(meeting.end),
      resource: meeting
    }));
  }, [visibleMeetings]);

  const upcomingMeetings = useMemo(() => {
    const now = new Date();
    const maxDate = new Date(now);
    maxDate.setDate(now.getDate() + 7);

    return visibleMeetings
      .filter((meeting) => {
        const start = new Date(meeting.start);
        return start >= now && start <= maxDate;
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [visibleMeetings]);

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <header className="rounded-xl border border-line bg-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-4xl font-semibold text-text-primary">Calendario</h1>
              <p className="text-base text-text-secondary">{formatHeaderDate(calendarDate, calendarView)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl border border-line bg-white p-1">
                {VIEW_OPTIONS.map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setCalendarView(view)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      calendarView === view
                        ? "bg-[#e9f0f7] text-brand-primary"
                        : "text-text-secondary hover:bg-[#f3f7fa]"
                    )}
                  >
                    {formatViewLabel(view)}
                  </button>
                ))}
              </div>

              <Button type="button" variant="secondary" className="w-auto px-4" onClick={() => setCalendarDate(new Date())}>
                Hoy
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="w-auto px-3"
                onClick={() => {
                  const nextDate = new Date(calendarDate);
                  if (calendarView === Views.DAY) {
                    nextDate.setDate(nextDate.getDate() - 1);
                  } else if (calendarView === Views.WEEK) {
                    nextDate.setDate(nextDate.getDate() - 7);
                  } else {
                    nextDate.setMonth(nextDate.getMonth() - 1);
                  }
                  setCalendarDate(nextDate);
                }}
              >
                Anterior
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="w-auto px-3"
                onClick={() => {
                  const nextDate = new Date(calendarDate);
                  if (calendarView === Views.DAY) {
                    nextDate.setDate(nextDate.getDate() + 1);
                  } else if (calendarView === Views.WEEK) {
                    nextDate.setDate(nextDate.getDate() + 7);
                  } else {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                  }
                  setCalendarDate(nextDate);
                }}
              >
                Siguiente
              </Button>

              <Button
                type="button"
                className="w-auto px-4"
                onClick={() => {
                  setSelectedMeeting(null);
                  setSlotStart(new Date());
                  setModalOpen(true);
                }}
              >
                + Nueva reunion
              </Button>
            </div>
          </div>
        </header>

        <Card className="p-6">
          <div className="h-[720px]">
            <CalendarComponent
              localizer={localizer}
              events={events}
              culture="es"
              view={calendarView}
              onView={(nextView: View) => setCalendarView(nextView)}
              date={calendarDate}
              onNavigate={(date: Date) => setCalendarDate(date)}
              startAccessor="start"
              endAccessor="end"
              selectable
              popup
              toolbar={false}
              onSelectEvent={(event: CalendarEvent) => {
                setSelectedMeeting(event.resource);
                setSlotStart(null);
                setModalOpen(true);
              }}
              onSelectSlot={(slot: SlotInfo) => {
                setSelectedMeeting(null);
                setSlotStart(slot.start);
                setModalOpen(true);
              }}
              components={{
                event: ({ event }: { event: CalendarEvent }) => (
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-1.5 py-0.5 text-[10px] font-semibold",
                        event.scope === "general"
                          ? "border-line bg-white/80 text-text-secondary"
                          : "border-brand-primary/25 bg-brand-primary/10 text-brand-primary"
                      )}
                    >
                      {event.scope === "general" ? "GENERAL" : "EQUIPO"}
                    </span>
                    <span className="truncate">{event.title}</span>
                  </div>
                )
              }}
              messages={{
                month: "Mes",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                today: "Hoy",
                previous: "Anterior",
                next: "Siguiente",
                noEventsInRange: "No hay reuniones en este rango."
              }}
              eventPropGetter={() => ({
                className: "rounded-lg border border-brand-primary/20 bg-[#e9f0f7] text-text-primary"
              })}
            />
          </div>
        </Card>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-6">
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-text-primary">Proximas reuniones</h2>
            <Button
              type="button"
              variant="secondary"
              className="w-auto px-3 py-1.5 text-sm"
              onClick={() => {
                setSelectedMeeting(null);
                setSlotStart(new Date());
                setModalOpen(true);
              }}
            >
              Programar
            </Button>
          </div>

          <ul className="space-y-2 text-base text-text-secondary">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting) => (
                <li key={meeting.id} className="rounded-lg bg-[#f7fafc] px-3 py-2">
                  <div className="mb-1 flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-1.5 py-0.5 text-[10px] font-semibold",
                        meeting.scope === "general"
                          ? "border-line bg-white text-text-secondary"
                          : "border-brand-primary/25 bg-brand-primary/10 text-brand-primary"
                      )}
                    >
                      {meeting.scope === "general" ? "GENERAL" : "EQUIPO"}
                    </span>
                    <p className="text-base font-medium text-text-primary">{meeting.title}</p>
                  </div>
                  <p className="text-sm">{format(new Date(meeting.start), "EEE, d MMM - HH:mm", { locale: es })}</p>
                </li>
              ))
            ) : (
              <li className="rounded-lg bg-[#f7fafc] px-3 py-2">No hay reuniones en los proximos 7 dias.</li>
            )}
          </ul>
        </Card>
      </aside>

      <MeetingModal
        open={modalOpen}
        currentTeamName={currentTeam?.name}
        meeting={selectedMeeting}
        initialStart={slotStart}
        onClose={() => {
          setModalOpen(false);
          setSelectedMeeting(null);
          setSlotStart(null);
        }}
        onCreate={(payload) => {
          if (payload.scope === "team" && !currentTeam) {
            return;
          }

          createMeeting({
            scope: payload.scope,
            teamId: payload.scope === "team" ? currentTeam?.id : null,
            title: payload.title,
            description: payload.description,
            start: payload.start,
            end: payload.end,
            location: payload.location,
            createdById: "user-1",
            authorName: "Usuario Demo"
          });

          setModalOpen(false);
          setSlotStart(null);
        }}
        onSave={(meetingId, payload) => {
          updateMeeting(meetingId, {
            ...payload,
            teamId: payload.scope === "team" ? currentTeam?.id : null,
            authorName: "Usuario Demo"
          });
          setModalOpen(false);
          setSelectedMeeting(null);
        }}
        onDelete={(meetingId) => {
          deleteMeeting(meetingId, "Usuario Demo");
          setModalOpen(false);
          setSelectedMeeting(null);
        }}
      />
    </section>
  );
}
