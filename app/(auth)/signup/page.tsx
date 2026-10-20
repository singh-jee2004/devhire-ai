"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Code2,
    Building2,
    User,
    Mail,
    Lock,
    ArrowRight,
    Briefcase,
    AlertCircle,
    CheckCircle2,
    Loader2,
} from "lucide-react";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get("role") === "recruiter" ? "recruiter" : "candidate";

    const [role, setRole] = useState<"candidate" | "recruiter">(initialRole);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("mid");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successInfo, setSuccessInfo] = useState<string | null>(null);

    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessInfo(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        full_name: fullName.trim(),
                        role,
                        company_name: role === "recruiter" ? companyName.trim() : null,
                        job_title: role === "recruiter" ? jobTitle.trim() : null,
                        experience_level: role === "candidate" ? experienceLevel : null,
                    },
                },
            });

            if (error) {
                setErrorMsg(error.message);
                return;
            }

            // Ensure profile exists in public.profiles table
            if (data.user) {
                await supabase.from("profiles").upsert({
                    id: data.user.id,
                    full_name: fullName.trim(),
                    email: email.trim(),
                    role,
                    company_name: role === "recruiter" ? companyName.trim() : null,
                    job_title: role === "recruiter" ? jobTitle.trim() : null,
                    experience_level: role === "candidate" ? experienceLevel : null,
                });
            }

            // Check if email confirmation is required by Supabase
            if (data.user && !data.session) {
                setSuccessInfo("Account created successfully! If email confirmation is enabled, please verify your inbox before signing in.");
                return;
            }

            if (role === "candidate") {
                router.push("/candidate/dashboard");
            } else {
                router.push("/recruiter/dashboard");
            }
        } catch {
            setErrorMsg("An unexpected error occurred. Please try again.");
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
                    redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
                },
            });
            if (error) setErrorMsg(error.message);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "OAuth sign-in failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent blur-[140px] pointer-events-none -z-10" />

            {/* Brand Header */}
            <div className="mb-8 text-center">
                <Link href="/" className="inline-flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
                        <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        DevHire <span className="text-cyan-400">AI</span>
                    </span>
                </Link>
                <h1 className="text-2xl font-bold text-white mt-4">Create your account</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Join the candidate intelligence platform for modern developers
                </p>
            </div>

            <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                {/* Role Selector Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800/80 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole("candidate")}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === "candidate"
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Developer
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("recruiter")}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === "recruiter"
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        <Building2 className="w-4 h-4" />
                        Recruiter
                    </button>
                </div>

                {successInfo && (
                    <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-semibold">{successInfo}</p>
                            <Link href="/login" className="text-cyan-400 underline font-medium block pt-1">
                                Proceed to Sign In →
                            </Link>
                        </div>
                    </div>
                )}

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
                        <span className="bg-slate-900/90 px-2 text-slate-500">Or register with email</span>
                    </div>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Alex Morgan"
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            {role === "recruiter" ? "Work Email" : "Email Address"}
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={role === "recruiter" ? "alex@company.com" : "alex@example.com"}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Conditional Fields: Recruiter */}
                    {role === "recruiter" ? (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Company Name</label>
                                <div className="relative">
                                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Acme Technologies"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Job Role</label>
                                <div className="relative">
                                    <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        placeholder="Technical Talent Lead"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Conditional Fields: Candidate */
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Experience Level</label>
                            <select
                                value={experienceLevel}
                                onChange={(e) => setExperienceLevel(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            >
                                <option value="entry">Fresher / Junior (0 - 2 yrs)</option>
                                <option value="mid">Mid-Level (2 - 5 yrs)</option>
                                <option value="senior">Senior (5+ yrs)</option>
                                <option value="lead">Lead / Architect (8+ yrs)</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                required
                                minLength={6}
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
                                <span>Create {role === "recruiter" ? "Recruiter" : "Developer"} Account</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-slate-400 text-sm">
                    Loading sign up...
                </div>
            }
        >
            <SignupForm />
        </Suspense>
    );
}

