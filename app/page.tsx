"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBoardStore } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useBoardStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(
    () => useBoardStore.persist?.hasHydrated() ?? false
  );

  useEffect(() => {
    const unsub = useBoardStore.persist?.onFinishHydration(() => {
      setHydrated(true);
    });
    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (hydrated) {
      router.replace(isAuthenticated ? "/board" : "/login");
    }
  }, [hydrated, isAuthenticated, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
