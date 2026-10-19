"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    Code2,
    FileText,
    GitBranch,
    Bot,
    Terminal,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Clock,
    Briefcase,
    TrendingUp,
    ExternalLink,
    ChevronRight,
    LogOut,
    User,
    AlertCircle,
    Building2,
    Layers,
} from "lucide-react";

interface ApplicationItem {
    id: string;
    role: string;
    company: string;
    status: "applied" | "screening" | "assessment" | "interview" | "shortlisted";
    matchScore: number;
    appliedDate: string;
}

export default function CandidateDashboard() {
    const [candidateName, setCandidateName] = useState("Developer");
    const [profileStrength, setProfileStrength] = useState(82);
    const supabase = createClient();

    useEffect(() => {
        async function loadUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setCandidateName(user.user_metadata?.full_name || "Developer");
            }
        }
        loadUser();
    }, [supabase]);

    const recentApplications: ApplicationItem[] = [
        {
            id: "app-1",
            role: "Senior Full Stack Engineer",
            company: "Synthetix Labs",
            status: "assessment",
            matchScore: 92,
            appliedDate: "Yesterday",
        },
        {
            id: "app-2",
            role: "Frontend AI Engineer",
            company: "CognitiveFlow",
            status: "interview",
            matchScore: 88,
            appliedDate: "3 days ago",
        },
        {
            id: "app-3",
            role: "TypeScript Systems Engineer",
            company: "NextGen Cloud",
            status: "screening",
            matchScore: 79,
            appliedDate: "May 12",
        },
    ];

    const recommendedJobs = [
        {
            id: "rec-1",
            title: "React & Next.js Core Developer",
            company: "HyperScale",
            match: 95,
            tags: ["React 19", "Next.js", "TypeScript"],
        },
        {
            id: "rec-2",
            title: "Backend Node.js API Architect",
            company: "DataVessel",
            match: 91,
            tags: ["Node.js", "PostgreSQL", "Redis"],
        },
        {
            id: "rec-3",
            title: "Full Stack Engineer (AI Integration)",
            company: "NeuralPulse",
            match: 86,
            tags: ["Python", "FastAPI", "React"],
        },
    ];

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-1/4 w-[700px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[140px]" />
            </div>

            {/* Candidate Navigation Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/80 bg-[#07090e]/80">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <Link href="/candidate/dashboard" className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                                DevHire <span className="text-cyan-400">AI</span>
                            </span>
                            <span className="block text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
                                Candidate Portal
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                        <Link href="/candidate/dashboard" className="text-cyan-400 font-semibold">
                            Dashboard
                        </Link>
                        <Link href="/candidate/resume" className="hover:text-cyan-400 transition-colors">
                            AI Resume
                        </Link>
                        <Link href="/candidate/github" className="hover:text-cyan-400 transition-colors">
                            GitHub Audit
                        </Link>
                        <Link href="/jobs" className="hover:text-cyan-400 transition-colors">
                            Browse Jobs
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Available for Hire</span>
                        </div>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = "/";
                            }}
                            className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
                {/* Welcome & Profile Strength Banner */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/20 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Candidate Intelligence Active</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                            Welcome back, {candidateName}!
                        </h1>
                        <p className="text-sm text-slate-400 max-w-xl">
                            Your profile is being actively matched against open engineering roles. Complete your
                            assessments to unlock automatic recruiter shortlisting.
                        </p>
                    </div>

                    {/* Profile Strength Gauge */}
                    <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl min-w-[260px] space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-400 uppercase tracking-wider">Profile Strength</span>
                            <span className="text-cyan-400 font-bold">{profileStrength}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${profileStrength}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Resume & GitHub Connected
                        </p>
                    </div>
                </div>

                {/* 4 Quick Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/candidate/resume"
                        className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-cyan-400 transition-colors">
                            AI Resume Parser
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Upload PDF to extract technical skills & experience levels with confidence scores.
                        </p>
                    </Link>

                    <Link
                        href="/candidate/github"
                        className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900/80 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                            <GitBranch className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-purple-400 transition-colors">
                            GitHub Audit
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Analyze repository architectures, code quality, and real engineering signals.
                        </p>
                    </Link>

                    <Link
                        href="/candidate/assessments"
                        className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-amber-400 transition-colors">
                            Coding Sandbox
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Take live technical challenges and verify test case correctness in real time.
                        </p>
                    </Link>

                    <Link
                        href="/candidate/interview"
                        className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                            <Bot className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-emerald-400 transition-colors">
                            AI Technical Interview
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Practice scenario & architecture questions with our dynamic AI interviewer.
                        </p>
                    </Link>
                </div>

                {/* 2-Column Section: Applications vs Recommended Jobs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Active Applications (8 cols) */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white">Active Applications</h2>
                                <p className="text-xs text-slate-400">Track your progress across hiring pipelines</p>
                            </div>
                            <Link href="/jobs" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                                Explore more jobs <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentApplications.map((app) => (
                                <div
                                    key={app.id}
                                    className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-white text-sm">{app.role}</h3>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                                                {app.matchScore}% Match
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 flex items-center gap-2">
                                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                            <span>{app.company}</span>
                                            <span>•</span>
                                            <span>Applied {app.appliedDate}</span>
                                        </p>
                                    </div>

                                    {/* Stage Stepper Badge */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-xs px-3 py-1 rounded-full font-mono font-medium capitalize border ${app.status === "assessment"
                                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                    : app.status === "interview"
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                }`}
                                        >
                                            Stage: {app.status}
                                        </span>
                                        <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Recommended Jobs (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                <span>AI Recommended</span>
                            </h2>
                            <p className="text-xs text-slate-400">Matched to your verified skill profile</p>
                        </div>

                        <div className="space-y-3">
                            {recommendedJobs.map((rec) => (
                                <div
                                    key={rec.id}
                                    className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors">
                                                {rec.title}
                                            </h4>
                                            <p className="text-xs text-slate-400">{rec.company}</p>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                                            {rec.match}%
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {rec.tags.map((t) => (
                                            <span
                                                key={t}
                                                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <Link
                                        href="/jobs"
                                        className="block text-center text-xs font-semibold py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 text-white hover:text-slate-950 transition-colors"
                                    >
                                        1-Click Apply
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
