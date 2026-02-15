"use client";

import {
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Plus,
} from "lucide-react";

import { useBoardStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ToolbarProps {
    onAddTask: () => void;
    onToggleActivity: () => void;
}

export function Toolbar({ onAddTask, onToggleActivity }: ToolbarProps) {
    const searchQuery = useBoardStore((s) => s.searchQuery);
    const setSearchQuery = useBoardStore((s) => s.setSearchQuery);
    const priorityFilter = useBoardStore((s) => s.priorityFilter);
    const setPriorityFilter = useBoardStore((s) => s.setPriorityFilter);
    const sortDirection = useBoardStore((s) => s.sortDirection);
    const setSortDirection = useBoardStore((s) => s.setSortDirection);

    const cycleSortDirection = () => {
        if (sortDirection === "none") setSortDirection("asc");
        else if (sortDirection === "asc") setSortDirection("desc");
        else setSortDirection("none");
    };

    const SortIconComponent =
        sortDirection === "asc"
            ? ArrowUp
            : sortDirection === "desc"
                ? ArrowDown
                : ArrowUpDown;

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-card/50 border-border/50"
                    />
                </div>

                <Select
                    value={priorityFilter}
                    onValueChange={(val) =>
                        setPriorityFilter(val as "All" | "Low" | "Medium" | "High")
                    }
                >
                    <SelectTrigger className="w-35 bg-card/50 border-border/50">
                        <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Priorities</SelectItem>
                        <SelectItem value="Low">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low
                            </span>
                        </SelectItem>
                        <SelectItem value="Medium">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium
                            </span>
                        </SelectItem>
                        <SelectItem value="High">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-rose-500" /> High
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={cycleSortDirection}
                    className={`bg-card/50 border-border/50 ${sortDirection !== "none" ? "text-violet-400 border-violet-500/30" : "text-muted-foreground"
                        }`}
                    title={
                        sortDirection === "none"
                            ? "Sort by due date"
                            : sortDirection === "asc"
                                ? "Sorted: earliest first"
                                : "Sorted: latest first"
                    }
                >
                    <SortIconComponent className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleActivity}
                    className="text-muted-foreground bg-card/50 border-border/50"
                >
                    Activity
                </Button>

                <Button
                    onClick={onAddTask}
                    size="sm"
                    className="bg-linear-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white shadow-md shadow-violet-500/20"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </div>
        </div>
    );
}
