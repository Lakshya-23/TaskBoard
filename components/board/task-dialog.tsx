"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { TaskFormSchema, type TaskFormValues, type Task } from "@/lib/schemas";
import { useBoardStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingTask: Task | null;
}

export function TaskDialog({ open, onOpenChange, editingTask }: TaskDialogProps) {
    const addTask = useBoardStore((s) => s.addTask);
    const updateTask = useBoardStore((s) => s.updateTask);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<TaskFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(TaskFormSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            priority: "Medium",
            dueDate: "",
            tags: "",
        },
    });

    const dueDateValue = useWatch({ control, name: "dueDate" });
    const priorityValue = useWatch({ control, name: "priority" });

    useEffect(() => {
        if (open) {
            if (editingTask) {
                reset({
                    title: editingTask.title,
                    description: editingTask.description || "",
                    priority: editingTask.priority,
                    dueDate: editingTask.dueDate || "",
                    tags: editingTask.tags.join(", "),
                });
            } else {
                reset({
                    title: "",
                    description: "",
                    priority: "Medium",
                    dueDate: "",
                    tags: "",
                });
            }
        }
    }, [open, editingTask, reset]);

    const onSubmit = (data: TaskFormValues) => {
        const tags = data.tags
            ? data.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [];

        if (editingTask) {
            updateTask(editingTask.id, {
                title: data.title,
                description: data.description || "",
                priority: data.priority,
                dueDate: data.dueDate || undefined,
                tags,
            });
            toast.success("Task updated", {
                description: `"${data.title}" has been updated.`,
            });
        } else {
            addTask({
                title: data.title,
                description: data.description || "",
                priority: data.priority,
                dueDate: data.dueDate || undefined,
                tags,
                status: "Todo",
            });
            toast.success("Task created", {
                description: `"${data.title}" added to To Do.`,
            });
        }

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-120 border-border/50 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        {editingTask ? "Edit Task" : "Add New Task"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="title">Title *</Label>
                        <Input id="title" placeholder="What needs to be done?" {...register("title")} />
                        {errors.title && (
                            <p className="text-xs text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            rows={3}
                            placeholder="Add more details…"
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            {...register("description")}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Priority</Label>
                            <Select
                                value={priorityValue}
                                onValueChange={(val) =>
                                    setValue("priority", val as "Low" | "Medium" | "High")
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            Low
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="Medium">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                                            Medium
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="High">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-rose-500" />
                                            High
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Due Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !dueDateValue && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dueDateValue
                                            ? format(new Date(dueDateValue), "MMM d, yyyy")
                                            : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dueDateValue ? new Date(dueDateValue) : undefined}
                                        onSelect={(date) =>
                                            setValue("dueDate", date ? date.toISOString() : "")
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            placeholder="bug, frontend, urgent (comma-separated)"
                            {...register("tags")}
                        />
                        <p className="text-[11px] text-muted-foreground">
                            Separate multiple tags with commas
                        </p>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-linear-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white"
                        >
                            {editingTask ? "Save Changes" : "Add Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
