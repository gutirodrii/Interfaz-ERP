"use client";

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { KanbanColumn } from "@/components/tasks/KanbanColumn";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { TaskModal, type TaskFormValues } from "@/components/tasks/TaskModal";
import { Button } from "@/components/ui/button";
import { useTeamContext } from "@/context/TeamContext";
import { useWorkContext } from "@/context/WorkContext";
import { cn } from "@/lib/cn";
import { mockUsersByTeam } from "@/lib/mockUsers";
import type { Task, TaskPriority, TaskStatus, User } from "@/lib/types";

const STATUS_COLUMNS: Array<{ status: TaskStatus; label: string }> = [
  { status: "todo", label: "Pendiente" },
  { status: "in_progress", label: "En progreso" },
  { status: "done", label: "Completado" }
];

type DueFilter = "all" | "overdue" | "this_week";

function isOverdueTask(task: Task): boolean {
  if (!task.dueDate || task.status === "done") {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
}

function isWithinThisWeek(task: Task): boolean {
  if (!task.dueDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const dueDate = new Date(task.dueDate);
  return dueDate >= today && dueDate <= endOfWeek;
}

type SortableTaskProps = {
  task: Task;
  assignee?: User;
  onOpenTask: (taskId: string) => void;
};

function SortableTask({ task, assignee, onOpenTask }: SortableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        assignee={assignee}
        onOpen={() => onOpenTask(task.id)}
        isOverdue={isOverdueTask(task)}
        className={cn(isDragging && "opacity-70")}
        {...attributes}
        {...listeners}
      />
    </div>
  );
}

type DroppableColumnProps = {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  usersById: Map<string, User>;
  onOpenTask: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
};

function DroppableColumn({
  status,
  title,
  tasks,
  usersById,
  onOpenTask,
  onAddTask
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <KanbanColumn title={title} count={tasks.length} onAdd={() => onAddTask(status)}>
      <div
        ref={setNodeRef}
        className={cn("min-h-[220px] space-y-3 rounded-xl p-1 transition-colors", isOver && "bg-[#eef4f8]")}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              assignee={task.assigneeId ? usersById.get(task.assigneeId) : undefined}
              onOpenTask={onOpenTask}
            />
          ))}
        </SortableContext>
      </div>
    </KanbanColumn>
  );
}

export default function TasksPage() {
  const { currentTeam } = useTeamContext();
  const { tasksByTeam, createTask, updateTask, moveTask, deleteTask } = useWorkContext();

  const [search, setSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>("all");
  const [dueFilter, setDueFilter] = useState<DueFilter>("all");

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalDefaults, setTaskModalDefaults] = useState<Partial<TaskFormValues>>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeDragTaskId, setActiveDragTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const teamTasks = currentTeam ? tasksByTeam[currentTeam.id] ?? [] : [];
  const teamUsers = currentTeam ? mockUsersByTeam[currentTeam.id] ?? [] : [];
  const usersById = useMemo(() => new Map(teamUsers.map((user) => [user.id, user])), [teamUsers]);

  const filteredTasks = useMemo(() => {
    return teamTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesAssignee = !assigneeFilter || task.assigneeId === assigneeFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      const matchesDueFilter =
        dueFilter === "all" ||
        (dueFilter === "overdue" && isOverdueTask(task)) ||
        (dueFilter === "this_week" && isWithinThisWeek(task));

      return matchesSearch && matchesAssignee && matchesPriority && matchesDueFilter;
    });
  }, [teamTasks, search, assigneeFilter, priorityFilter, dueFilter]);

  const tasksByStatus = useMemo(() => {
    return {
      todo: filteredTasks.filter((task) => task.status === "todo"),
      in_progress: filteredTasks.filter((task) => task.status === "in_progress"),
      done: filteredTasks.filter((task) => task.status === "done")
    };
  }, [filteredTasks]);

  const selectedTask = selectedTaskId ? teamTasks.find((task) => task.id === selectedTaskId) ?? null : null;
  const activeDragTask = activeDragTaskId ? teamTasks.find((task) => task.id === activeDragTaskId) ?? null : null;

  function handleCreateTask(values: TaskFormValues) {
    if (!currentTeam) {
      return;
    }

    createTask({
      teamId: currentTeam.id,
      title: values.title,
      description: values.description,
      assigneeId: values.assigneeId,
      dueDate: values.dueDate,
      priority: values.priority,
      status: values.status
    });

    setTaskModalOpen(false);
    setTaskModalDefaults({});
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDragTaskId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragTaskId(null);

    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeTask = teamTasks.find((task) => task.id === String(active.id));
    if (!activeTask) {
      return;
    }

    const overId = String(over.id);
    const statusIds = STATUS_COLUMNS.map((column) => column.status);

    let destinationStatus: TaskStatus;
    let destinationIndex: number;

    if (statusIds.includes(overId as TaskStatus)) {
      destinationStatus = overId as TaskStatus;
      destinationIndex = tasksByStatus[destinationStatus].length;
    } else {
      const overTask = teamTasks.find((task) => task.id === overId);
      if (!overTask) {
        return;
      }
      destinationStatus = overTask.status;
      const indexWithinColumn = tasksByStatus[destinationStatus].findIndex((task) => task.id === overId);
      destinationIndex = indexWithinColumn >= 0 ? indexWithinColumn : tasksByStatus[destinationStatus].length;
    }

    moveTask(activeTask.id, destinationStatus, destinationIndex);
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-4xl font-semibold text-text-primary">Tareas</h1>
          <p className="text-base text-text-secondary">
            Arrastra y gestiona tareas por equipo. Las actualizaciones se sincronizan con el feed.
          </p>
        </div>
        <Button
          type="button"
          className="w-auto px-5"
          onClick={() => {
            setTaskModalDefaults({ status: "todo", priority: "medium" });
            setTaskModalOpen(true);
          }}
        >
          + Nueva tarea
        </Button>
      </header>

      <div className="grid gap-4 rounded-xl border border-line bg-surface p-6 shadow-sm md:grid-cols-4">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar tareas..."
          className="h-11 rounded-xl border border-line bg-white px-3 text-base text-text-primary shadow-sm placeholder:text-text-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
          aria-label="Buscar tareas"
        />

        <select
          value={assigneeFilter}
          onChange={(event) => setAssigneeFilter(event.target.value)}
          className="h-11 rounded-xl border border-line bg-white px-3 text-base text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
          aria-label="Filtrar por responsable"
        >
          <option value="">Todos los responsables</option>
          {teamUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value as "all" | TaskPriority)}
          className="h-11 rounded-xl border border-line bg-white px-3 text-base text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
          aria-label="Filtrar por prioridad"
        >
          <option value="all">Todas las prioridades</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>

        <select
          value={dueFilter}
          onChange={(event) => setDueFilter(event.target.value as DueFilter)}
          className="h-11 rounded-xl border border-line bg-white px-3 text-base text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
          aria-label="Filtrar por fecha"
        >
          <option value="all">Todas las fechas</option>
          <option value="overdue">Vencidas</option>
          <option value="this_week">Esta semana</option>
        </select>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveDragTaskId(null)}
      >
        <div className="grid gap-6 xl:grid-cols-3">
          {STATUS_COLUMNS.map((column) => (
            <DroppableColumn
              key={column.status}
              status={column.status}
              title={column.label}
              tasks={tasksByStatus[column.status]}
              usersById={usersById}
              onOpenTask={setSelectedTaskId}
              onAddTask={(status) => {
                setTaskModalDefaults({ status, priority: "medium" });
                setTaskModalOpen(true);
              }}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDragTask ? (
            <div className="w-[290px]">
              <TaskCard
                task={activeDragTask}
                assignee={activeDragTask.assigneeId ? usersById.get(activeDragTask.assigneeId) : undefined}
                isOverdue={isOverdueTask(activeDragTask)}
                onOpen={() => undefined}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        open={taskModalOpen}
        users={teamUsers}
        initialValues={taskModalDefaults}
        onClose={() => {
          setTaskModalOpen(false);
          setTaskModalDefaults({});
        }}
        onSubmit={handleCreateTask}
      />

      <TaskDrawer
        open={Boolean(selectedTask)}
        task={selectedTask}
        users={teamUsers}
        onClose={() => setSelectedTaskId(null)}
        onSave={(taskId, updates) => {
          const currentTask = teamTasks.find((task) => task.id === taskId);
          if (!currentTask) {
            return;
          }

          if (updates.status && updates.status !== currentTask.status) {
            const destinationCount = teamTasks.filter((task) => task.status === updates.status).length;
            moveTask(taskId, updates.status as TaskStatus, destinationCount);
          }

          const { status: _ignoredStatus, ...rest } = updates;
          updateTask(taskId, rest);
        }}
        onDelete={(taskId) => deleteTask(taskId)}
      />
    </section>
  );
}
