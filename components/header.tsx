"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    LogOut,
    RotateCcw,
} from "lucide-react";
import { useBoardStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
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

export function Header() {
    const router = useRouter();
    const logout = useBoardStore((s) => s.logout);
    const resetBoard = useBoardStore((s) => s.resetBoard);

    const handleLogout = () => {
        logout();
        toast.info("Logged out successfully");
        router.replace("/login");
    };

    const handleReset = () => {
        resetBoard();
        toast.success("Board reset", {
            description: "All tasks and activity logs have been cleared.",
        });
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight">
                        Task<span className="">Board</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Reset Board?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete all tasks and activity logs.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleReset}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Reset Everything
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
