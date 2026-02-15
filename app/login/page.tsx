"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { LoginFormSchema, type LoginFormValues } from "@/lib/schemas";
import { useBoardStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const VALID_EMAIL = "intern@demo.com";
const VALID_PASSWORD = "intern123";

export default function LoginPage() {
    const router = useRouter();
    const login = useBoardStore((s) => s.login);
    const isAuthenticated = useBoardStore((s) => s.isAuthenticated);
    const [showPassword, setShowPassword] = useState(false);
    const [hydrated, setHydrated] = useState(() =>
        useBoardStore.persist?.hasHydrated() ?? false
    );

    useEffect(() => {
        const unsub = useBoardStore.persist?.onFinishHydration(() =>
            setHydrated(true)
        );
        return () => unsub?.();
    }, []);

    useEffect(() => {
        if (hydrated && isAuthenticated) {
            router.replace("/board");
        }
    }, [hydrated, isAuthenticated, router]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(LoginFormSchema) as any,
        defaultValues: { email: "", password: "", rememberMe: false },
    });

    const onSubmit = (data: LoginFormValues) => {
        if (data.email === VALID_EMAIL && data.password === VALID_PASSWORD) {
            login(data.rememberMe ?? false);
            toast.success("Welcome back!", { description: "Redirecting to your board…" });
            router.push("/board");
        } else {
            toast.error("Invalid credentials", {
                description: "Use intern@demo.com / intern123",
            });
        }
    };

    if (!hydrated) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
            {/* Ambient gradient blobs */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-125 w-125 rounded-full bg-linear-to-br from-violet-500/20 to-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-40 -bottom-40 h-125 w-125 rounded-full bg-linear-to-tr from-rose-500/20 to-amber-500/20 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Welcome to TaskBoard
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="intern@demo.com"
                                        className="pl-10"
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10"
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-2">
                                <input
                                    id="rememberMe"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-border bg-background accent-violet-600"
                                    {...register("rememberMe")}
                                />
                                <Label htmlFor="rememberMe" className="text-sm cursor-pointer text-muted-foreground">
                                    Remember me
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-linear-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-violet-500/25 transition-all duration-200"
                            >
                                {isSubmitting ? "Signing in…" : "Sign in"}
                            </Button>

                            <p className="text-center text-xs text-muted-foreground">
                                Demo: <span className="font-medium text-foreground/70">intern@demo.com</span> /{" "}
                                <span className="font-medium text-foreground/70">intern123</span>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
