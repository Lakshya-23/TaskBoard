"use client";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useBoardStore } from "@/lib/store";

function subscribeToPersistHydration(callback: () => void) {
    const unsub = useBoardStore.persist.onFinishHydration(callback);
    return () => unsub();
}

function getPersistHydrated() {
    return useBoardStore.persist?.hasHydrated() ?? false;
}

function getServerHydrated() {
    return false;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const isAuthenticated = useBoardStore((s) => s.isAuthenticated);
    const hydrated = useSyncExternalStore(
        subscribeToPersistHydration,
        getPersistHydrated,
        getServerHydrated,
    );
    useEffect(() => {
        if (hydrated && !isAuthenticated) {
            router.replace("/login");
        }
    }, [hydrated, isAuthenticated, router]);

    if (!hydrated) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
