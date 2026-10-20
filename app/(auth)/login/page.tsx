"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Code2, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect");
    const oauthError = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(
        oauthError ? "Social authentication failed or was cancelled. Please try again." : null
    );

    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                if (error.message.toLowerCase().includes("email not confirmed")) {
                    setErrorMsg("Your email has not been confirmed yet. Please verify your inbox or disable 'Confirm email' in Supabase Auth settings.");
                } else if (error.message.toLowerCase().includes("invalid login credentials")) {
                    setErrorMsg("Incorrect email or password. Please verify your details.");
                } else {
                    setErrorMsg(error.message);
                }
                return;
            }

            if (!data.user) {
                setErrorMsg("No user returned. Please try again.");
                return;
            }

            // 1. Check user role from metadata or profiles table
            let role = data.user.user_metadata?.role;
            if (!role) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", data.user.id)
                    .maybeSingle();
                if (profile?.role) {
                    role = profile.role;
                }
            }

            // 2. Redirect accordingly
            if (redirectUrl) {
                router.push(redirectUrl);
            } else if (role === "recruiter") {
                router.push("/recruiter/dashboard");
            } else {
                router.push("/candidate/dashboard");
            }
        } catch {
            setErrorMsg("Failed to sign in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: "google" | "github") => {
        setErrorMsg(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback${redirectUrl ? `?next=${encodeURIComponent(redirectUrl)}` : ""}`,
                },
            });
            if (error) setErrorMsg(error.message);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "OAuth sign-in failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent blur-[140px] pointer-events-none -z-10" />

            <div className="mb-8 text-center">
                <Link href="/" className="inline-flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
                        <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        DevHire <span className="text-cyan-400">AI</span>
                    </span>
                </Link>
                <h1 className="text-2xl font-bold text-white mt-4">Welcome back</h1>
                <p className="text-sm text-slate-400 mt-1">Sign in to your DevHire AI workspace</p>
            </div>

            <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                {errorMsg && (
                    <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                        type="button"
                        onClick={() => handleOAuth("google")}
                        className="py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
                    >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 5c1.7 0 3 .7 3.7 1.4l2.8-2.8C16.8 2.1 14.6 1.3 12 1.3 7.5 1.3 3.7 3.9 1.9 7.7l3.4 2.6C6.1 7.4 8.8 5 12 5z" />
                            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                            <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4L1.9 7.3C.7 9.7 0 12.3 0 15.1c0 2.8.7 5.4 1.9 7.8l3.4-2.6c-.2-.7-.4-1.5-.4-2.4z" />
                            <path fill="#34A853" d="M12 23.7c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.9-2.2-6.9-5.2L1.7 16.4C3.5 20.3 7.5 23.7 12 23.7z" />
                        </svg>
                        <span>Google</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleOAuth("github")}
                        className="py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
                    >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>GitHub</span>
                    </button>
                </div>

                <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-mono">
                        <span className="bg-slate-900/90 px-2 text-slate-500">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-medium text-slate-300">Password</label>
                            <a href="#" className="text-xs text-cyan-400 hover:underline">
                                Forgot?
                            </a>
                        </div>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Don&apos;t have an account yet?{" "}
                    <Link href="/signup" className="text-cyan-400 font-semibold hover:underline">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-slate-400 text-sm">
                    Loading login...
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
