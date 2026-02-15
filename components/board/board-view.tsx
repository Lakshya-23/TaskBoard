"use client";

import { useState, useMemo, useCallback } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { useBoardStore } from "@/lib/store";
import type { Task, TaskStatus } from "@/lib/schemas";
import { Column } from "./column";
import { TaskCard } from "./task-card";

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
    { id: "Todo", title: "To Do", color: "from-blue-500/20 to-blue-600/5" },
    { id: "Doing", title: "In Progress", color: "from-amber-500/20 to-amber-600/5" },
    { id: "Done", title: "Done", color: "from-emerald-500/20 to-emerald-600/5" },
];

interface BoardViewProps {
    onEditTask: (task: Task) => void;
}

export function BoardView({ onEditTask }: BoardViewProps) {
    const tasks = useBoardStore((s) => s.tasks);
    const moveTask = useBoardStore((s) => s.moveTask);
    const reorderTask = useBoardStore((s) => s.reorderTask);
    const searchQuery = useBoardStore((s) => s.searchQuery);
    const priorityFilter = useBoardStore((s) => s.priorityFilter);
    const sortDirection = useBoardStore((s) => s.sortDirection);

    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    
    const filteredTasks = useMemo(() => {
        let result = [...tasks];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((t) => t.title.toLowerCase().includes(q));
        }

        if (priorityFilter !== "All") {
            result = result.filter((t) => t.priority === priorityFilter);
        }

        if (sortDirection !== "none") {
            result.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                const diff =
                    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                return sortDirection === "asc" ? diff : -diff;
            });
        }

        return result;
    }, [tasks, searchQuery, priorityFilter, sortDirection]);

    const getColumnTasks = useCallback(
        (status: TaskStatus) => filteredTasks.filter((t) => t.status === status),
        [filteredTasks]
    );

    const activeTask = useMemo(
        () => tasks.find((t) => t.id === activeId) || null,
        [tasks, activeId]
    );

    //DnD handlers 
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };


    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeTaskId = active.id as string;
        const overId = over.id as string;

        const task = tasks.find((t) => t.id === activeTaskId);
        if (!task) return;

        const isOverColumn = COLUMNS.some((c) => c.id === overId);
        let targetStatus: TaskStatus;
        let targetIndex: number | undefined;

        if (isOverColumn) {
            targetStatus = overId as TaskStatus;
            targetIndex = getColumnTasks(targetStatus).length;
        } else {
            const overTask = tasks.find((t) => t.id === overId);
            if (!overTask) return;
            targetStatus = overTask.status;
            const columnTasks = getColumnTasks(targetStatus);
            targetIndex = columnTasks.findIndex((t) => t.id === overId);
        }

        if (task.status === targetStatus) {
            if (targetIndex !== undefined) {
                reorderTask(activeTaskId, targetIndex);
            }
        } else {
            moveTask(activeTaskId, targetStatus, targetIndex);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}

            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-6">
                {COLUMNS.map((col) => (
                    <Column
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        color={col.color}
                        tasks={getColumnTasks(col.id)}
                        onEditTask={onEditTask}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? (
                    <TaskCard task={activeTask} isOverlay onEdit={() => { }} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
