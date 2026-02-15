"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
    Task,
    TaskStatus,
    Priority,
    ActivityLogEntry,
    ActivityAction,
} from "./schemas";

//Helper
function uid(): string {
    return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

function logEntry(
    action: ActivityAction,
    taskTitle: string,
    from?: string,
    to?: string
): ActivityLogEntry {
    return {
        id: uid(),
        action,
        taskTitle,
        from,
        to,
        timestamp: new Date().toISOString(),
    };
}

export interface BoardState {
    // Auth
    isAuthenticated: boolean;
    rememberMe: boolean;
    login: (remember: boolean) => void;
    logout: () => void;

    // Tasks
    tasks: Task[];
    addTask: (task: Omit<Task, "id" | "createdAt">) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (
        taskId: string,
        newStatus: TaskStatus,
        newIndex?: number
    ) => void;
    reorderTask: (taskId: string, newIndex: number) => void;
    resetBoard: () => void;
    // Activity Log
    activityLog: ActivityLogEntry[];
    clearLog: () => void;

    searchQuery: string;
    setSearchQuery: (q: string) => void;
    priorityFilter: Priority | "All";
    setPriorityFilter: (p: Priority | "All") => void;
    sortDirection: "asc" | "desc" | "none";
    setSortDirection: (d: "asc" | "desc" | "none") => void;
}

export const useBoardStore = create<BoardState>()(
    persist(
        (set, get) => ({
            
            isAuthenticated: false,
            rememberMe: false,
            login: (remember) =>
                set({ isAuthenticated: true, rememberMe: remember }),
            logout: () => set({ isAuthenticated: false, rememberMe: false }),
            tasks: [],
            addTask: (taskData) => {
                const task: Task = {
                    ...taskData,
                    id: uid(),
                    createdAt: new Date().toISOString(),
                };
                set((s) => ({
                    tasks: [...s.tasks, task],
                    activityLog: [
                        logEntry("created", task.title),
                        ...s.activityLog,
                    ],
                }));
            },

            updateTask: (id, updates) => {
                const existing = get().tasks.find((t) => t.id === id);
                if (!existing) return;
                set((s) => ({
                    tasks: s.tasks.map((t) =>
                        t.id === id ? { ...t, ...updates } : t
                    ),
                    activityLog: [
                        logEntry("edited", updates.title ?? existing.title),
                        ...s.activityLog,
                    ],
                }));
            },

            deleteTask: (id) => {
                const existing = get().tasks.find((t) => t.id === id);
                if (!existing) return;
                set((s) => ({
                    tasks: s.tasks.filter((t) => t.id !== id),
                    activityLog: [
                        logEntry("deleted", existing.title),
                        ...s.activityLog,
                    ],
                }));
            },

            moveTask: (taskId, newStatus, newIndex) => {
                const state = get();
                const task = state.tasks.find((t) => t.id === taskId);
                if (!task) return;

                const oldStatus = task.status;
                const remaining = state.tasks.filter((t) => t.id !== taskId);
                const updatedTask = { ...task, status: newStatus };

                if (newIndex !== undefined) {
                    const before = remaining.filter((t) => t.status !== newStatus);
                    const columnTasks = remaining.filter(
                        (t) => t.status === newStatus
                    );
                    columnTasks.splice(newIndex, 0, updatedTask);
                    set({
                        tasks: [...before, ...columnTasks],
                        activityLog:
                            oldStatus !== newStatus
                                ? [
                                    logEntry(
                                        "moved",
                                        task.title,
                                        oldStatus,
                                        newStatus
                                    ),
                                    ...state.activityLog,
                                ]
                                : state.activityLog,
                    });
                } else {
                    set({
                        tasks: [...remaining, updatedTask],
                        activityLog:
                            oldStatus !== newStatus
                                ? [
                                    logEntry(
                                        "moved",
                                        task.title,
                                        oldStatus,
                                        newStatus
                                    ),
                                    ...state.activityLog,
                                ]
                                : state.activityLog,
                    });
                }
            },

            reorderTask: (taskId, newIndex) => {
                const state = get();
                const task = state.tasks.find((t) => t.id === taskId);
                if (!task) return;

                const columnTasks = state.tasks.filter(
                    (t) => t.status === task.status
                );
                const otherTasks = state.tasks.filter(
                    (t) => t.status !== task.status
                );
                const reordered = columnTasks.filter((t) => t.id !== taskId);
                reordered.splice(newIndex, 0, task);

                set({ tasks: [...otherTasks, ...reordered] });
            },

            resetBoard: () =>
                set({ tasks: [], activityLog: [] }),
            activityLog: [],
            clearLog: () => set({ activityLog: [] }),
            searchQuery: "",
            setSearchQuery: (q) => set({ searchQuery: q }),
            priorityFilter: "All",
            setPriorityFilter: (p) => set({ priorityFilter: p }),
            sortDirection: "none",
            setSortDirection: (d) => set({ sortDirection: d }),
        }),
        {
            name: "taskboard-storage",
            partialize: (state) => ({
                isAuthenticated: state.rememberMe ? state.isAuthenticated : false,
                rememberMe: state.rememberMe,
                tasks: state.tasks,
                activityLog: state.activityLog,
            }),
        }
    )
);
