"use client";

import { useState } from "react";
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
    Sparkles,
    AlertCircle,
    Loader2,
} from "lucide-react";

export default function SignupPage() {
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

    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role,
                        company_name: role === "recruiter" ? companyName : null,
                        job_title: role === "recruiter" ? jobTitle : null,
                        experience_level: role === "candidate" ? experienceLevel : null,
                    },
                },
            });

            if (error) {
                setErrorMsg(error.message);
                return;
            }

            // Route to respective dashboard or profile setup
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

                {errorMsg && (
                    <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

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
