"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isPast, isToday } from "date-fns";
import {
    Calendar,
    GripVertical,
    Pencil,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import type { Task } from "@/lib/schemas";
import { useBoardStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskCardProps {
    task: Task;
    isOverlay?: boolean;
    onEdit: () => void;
}

const PRIORITY_STYLES = {
    High: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
} as const;

export function TaskCard({ task, isOverlay, onEdit }: TaskCardProps) {
    const deleteTask = useBoardStore((s) => s.deleteTask);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isOverdue =
        task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

    const handleDelete = () => {
        deleteTask(task.id);
        toast.success("Task deleted", {
            description: `"${task.title}" has been removed.`,
        });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group ${isDragging ? "opacity-40" : ""} ${isOverlay ? "rotate-3 scale-105" : ""
                }`}
        >
            <Card
                className={`relative border-border/50 bg-card/90 backdrop-blur-sm transition-all duration-200 hover:border-border hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 ${isOverlay ? "shadow-2xl shadow-violet-500/10 border-violet-500/30" : ""
                    }`}
            >
                <CardContent className="p-3.5">
                    
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <button
                                {...attributes}
                                {...listeners}
                                className="flex-shrink-0 cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground transition-colors active:cursor-grabbing"
                            >
                                <GripVertical className="h-4 w-4" />
                            </button>
                            <h3 className="text-sm font-medium leading-snug truncate">
                                {task.title}
                            </h3>
                        </div>
                        <Badge
                            variant="outline"
                            className={`text-[10px] flex-shrink-0 px-1.5 py-0 ${PRIORITY_STYLES[task.priority]
                                }`}
                        >
                            {task.priority}
                        </Badge>
                    </div>

                    {/* Description preview */}
                    {task.description && (
                        <p className="mb-2.5 text-xs text-muted-foreground line-clamp-2 pl-6">
                            {task.description}
                        </p>
                    )}


                    <div className="flex items-center justify-between pl-6">
                        <div className="flex items-center gap-3">

                            {task.dueDate && (
                                <div
                                    className={`flex items-center gap-1 text-[11px] ${isOverdue
                                        ? "text-rose-400"
                                        : isToday(new Date(task.dueDate))
                                            ? "text-amber-400"
                                            : "text-muted-foreground"
                                        }`}
                                >
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(task.dueDate), "MMM d")}
                                </div>
                            )}
                        </div>


                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                onClick={onEdit}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete {task.title}? This cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    {/* Tags */}
                    {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5 pl-6">
                            {task.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center rounded-sm bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400 ring-1 ring-inset ring-violet-500/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
