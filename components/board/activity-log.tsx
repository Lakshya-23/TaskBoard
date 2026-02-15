"use client";

import { formatDistanceToNow } from "date-fns";
import {
    PlusCircle,
    ArrowRight,
    Pencil,
    Trash2,
    Clock,
    X,
} from "lucide-react";

import { useBoardStore } from "@/lib/store";
import type { ActivityLogEntry } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

interface ActivityLogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ACTION_CONFIG: Record<
    string,
    { icon: typeof PlusCircle; color: string; label: string }
> = {
    created: { icon: PlusCircle, color: "text-emerald-400", label: "Created" },
    moved: { icon: ArrowRight, color: "text-blue-400", label: "Moved" },
    edited: { icon: Pencil, color: "text-amber-400", label: "Edited" },
    deleted: { icon: Trash2, color: "text-rose-400", label: "Deleted" },
};

function ActivityItem({ entry }: { entry: ActivityLogEntry }) {
    const config = ACTION_CONFIG[entry.action] || ACTION_CONFIG.created;
    const Icon = config.icon;

    return (
        <div className="flex items-start gap-3 py-3">
            <div
                className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted ${config.color}`}
            >
                <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">
                    <span className="font-medium">{config.label}</span>{" "}
                    <span className="text-muted-foreground">&ldquo;</span>
                    <span className="font-medium truncate">{entry.taskTitle}</span>
                    <span className="text-muted-foreground">&rdquo;</span>
                    {entry.action === "moved" && entry.from && entry.to && (
                        <span className="text-muted-foreground">
                            {" "}
                            from {entry.from} → {entry.to}
                        </span>
                    )}
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(entry.timestamp), {
                        addSuffix: true,
                    })}
                </div>
            </div>
        </div>
    );
}

export function ActivityLog({ open, onOpenChange }: ActivityLogProps) {
    const activityLog = useBoardStore((s) => s.activityLog);
    const clearLog = useBoardStore((s) => s.clearLog);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-95 sm:w-105 border-border/50 bg-card/95 backdrop-blur-xl">
                <SheetHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg">Activity Log</SheetTitle>
                    </div>
                </SheetHeader>

                <Separator className="my-4" />

                {activityLog.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <Clock className="h-10 w-10 mb-3 opacity-30" />
                        <p className="text-sm">No activity yet</p>
                        <p className="text-xs mt-1 opacity-60">
                            Actions will appear here
                        </p>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="h-[calc(100vh-200px)]">
                            <div className="pr-4">
                                {activityLog.map((entry, i) => (
                                    <div key={entry.id}>
                                        <ActivityItem entry={entry} />
                                        {i < activityLog.length - 1 && (
                                            <Separator className="opacity-30" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="pt-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-muted-foreground hover:text-destructive"
                                onClick={clearLog}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Clear Log
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
