"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Task } from "@/lib/schemas";
import { AuthGuard } from "@/components/auth-guard";
import { Header } from "@/components/header";
import { Toolbar } from "@/components/board/toolbar";
import { BoardView } from "@/components/board/board-view";
import { TaskDialog } from "@/components/board/task-dialog";
import { ActivityLog } from "@/components/board/activity-log";

export default function BoardPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [activityOpen, setActivityOpen] = useState(false);

    const handleAddTask = () => {
        setEditingTask(null);
        setDialogOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setDialogOpen(true);
    };

    return (
        <AuthGuard>
            <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <motion.main
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 mx-auto w-full max-w-360 px-4 py-6 md:px-6"
                >
                    <Toolbar
                        onAddTask={handleAddTask}
                        onToggleActivity={() => setActivityOpen(true)}
                    />
                    <BoardView onEditTask={handleEditTask} />
                </motion.main>

                <TaskDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    editingTask={editingTask}
                />
                <ActivityLog open={activityOpen} onOpenChange={setActivityOpen} />
            </div>
        </AuthGuard>
    );
}
