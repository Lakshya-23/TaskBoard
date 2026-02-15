"use client";

import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "motion/react";

import type { Task, TaskStatus } from "@/lib/schemas";
import { TaskCard } from "./task-card";

interface ColumnProps {
    id: TaskStatus;
    title: string;
    color: string;
    tasks: Task[];
    onEditTask: (task: Task) => void;
}

export function Column({ id, title, color, tasks, onEditTask }: ColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col rounded-2xl border border-border/50 bg-linear-to-b ${color} p-4 transition-colors duration-200 ${isOver ? "ring-2 ring-violet-500/50 border-violet-500/30" : ""
                }`}
        >
            {/* Column header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div
                        className={`h-2.5 w-2.5 rounded-full ${id === "Todo"
                                ? "bg-blue-500"
                                : id === "Doing"
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                            }`}
                    />
                    <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                        {title}
                    </h2>
                </div>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-2 text-xs font-medium text-muted-foreground">
                    {tasks.length}
                </span>
            </div>

            {/* Task list */}
            <SortableContext
                items={tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-1 flex-col gap-2.5 min-h-30">
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                <TaskCard task={task} onEdit={() => onEditTask(task)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {tasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/50 py-8"
                        >
                            <p className="text-sm text-muted-foreground/60">
                                Drop tasks here
                            </p>
                        </motion.div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
