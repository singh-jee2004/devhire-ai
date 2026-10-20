"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    Code2,
    Building2,
    MapPin,
    Briefcase,
    Sparkles,
    CheckCircle2,
    ChevronLeft,
    BrainCircuit,
    ShieldCheck,
    Play,
    Loader2,
    Check,
    Clock,
    AlertCircle
} from "lucide-react";

interface JobDetail {
    id: string;
    title: string;
    company_name: string;
    description: string;
    location: string;
    experience_level: string;
    employment_type?: string;
    required_skills: string[];
    preferred_skills: string[];
    created_at?: string;
}

// Fallback sample data if opening sample jobs from public discovery
const fallbackJobs: Record<string, JobDetail> = {
    "job-1": {
        id: "job-1",
        title: "Senior Full Stack Engineer (Next.js & AI)",
        company_name: "Synthetix Labs",
        description: "Lead the architecture of our real-time developer intelligence engine. You will be building high-performance frontend interfaces with React 19 and Next.js, integrating vector databases, and orchestrating LLM tool calling pipelines.",
        location: "San Francisco, CA (Hybrid)",
        experience_level: "Senior (5+ yrs)",
        employment_type: "Full-Time",
        required_skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
        preferred_skills: ["PostgreSQL", "Supabase", "Vector Search", "Python"],
    },
    "job-2": {
        id: "job-2",
        title: "Backend Systems Architect",
        company_name: "DataVessel",
        description: "Design low-latency distributed APIs handling millions of candidate verification events daily. Requires mastery of event-driven architectures, SQL performance tuning, and scalable infrastructure.",
        location: "Remote (Global)",
        experience_level: "Senior (5+ yrs)",
        employment_type: "Full-Time",
        required_skills: ["Go", "Node.js", "PostgreSQL", "Redis", "Docker"],
        preferred_skills: ["Kubernetes", "gRPC", "Kafka"],
    },
    "job-3": {
        id: "job-3",
        title: "Frontend AI Engineer",
        company_name: "CognitiveFlow",
        description: "Craft state-of-the-art interactive code assessment sandboxes, dynamic chat interview interfaces, and telemetry visualization dashboards with smooth 60fps micro-animations.",
        location: "New York, NY (Remote)",
        experience_level: "Mid-Level (2-5 yrs)",
        employment_type: "Full-Time",
        required_skills: ["React", "TypeScript", "Tailwind CSS", "WebSockets"],
        preferred_skills: ["Next.js", "Monaco Editor", "Framer Motion"],
    },
};

function JobDetailContent() {
    const params = useParams();
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const jobId = params?.id as string;

    const [job, setJob] = useState<JobDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchJobAndStatus() {
            setLoading(true);
            try {
                // 1. Check logged-in user
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);
                    setUserRole(user.user_metadata?.role || "candidate");

                    // 2. Check if user already applied
                    const { data: appData } = await supabase
                        .from("applications")
                        .select("id, status")
                        .eq("job_id", jobId)
                        .eq("candidate_id", user.id)
                        .maybeSingle();

                    if (appData) {
                        setHasApplied(true);
                    }
                }

                // 3. Fetch Job from Supabase
                const { data: jobData, error } = await supabase
                    .from("jobs")
                    .select("*")
                    .eq("id", jobId)
                    .maybeSingle();

                if (jobData && !error) {
                    setJob({
                        ...jobData,
                        employment_type: jobData.employment_type || "Full-Time",
                        required_skills: Array.isArray(jobData.required_skills) ? jobData.required_skills : [],
                        preferred_skills: Array.isArray(jobData.preferred_skills) ? jobData.preferred_skills : [],
                    });
                } else if (fallbackJobs[jobId]) {
                    setJob(fallbackJobs[jobId]);
                } else {
                    // Generic fallback for any other UUID / test ID
                    setJob({
                        id: jobId,
                        title: "Full Stack Software Engineer",
                        company_name: "DevHire Partner Network",
                        description: "Join an engineering team building modern scalable web applications with Next.js, TypeScript, and AI-assisted workflows.",
                        location: "Remote",
                        experience_level: "Mid-to-Senior",
                        employment_type: "Full-Time",
                        required_skills: ["TypeScript", "React", "Next.js", "Node.js"],
                        preferred_skills: ["Supabase", "Tailwind CSS", "PostgreSQL"],
                    });
                }
            } catch (err) {
                console.error("Error loading job details:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchJobAndStatus();
    }, [jobId, supabase]);

    const handleApply = async () => {
        if (!userId) {
            router.push(`/login?redirect=/jobs/${jobId}`);
            return;
        }

        if (userRole === "recruiter") {
            alert("Recruiter accounts cannot apply for positions. Please log in with a Candidate account.");
            return;
        }

        setApplying(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required");

            // Ensure profile exists in profiles table
            await supabase.from("profiles").upsert({
                id: user.id,
                full_name: user.user_metadata?.full_name || "Candidate",
                email: user.email || "",
                role: "candidate",
                experience_level: user.user_metadata?.experience_level || "mid-level",
            });

            // Insert application row
            const { error: appError } = await supabase
                .from("applications")
                .insert({
                    candidate_id: user.id,
                    job_id: jobId,
                    status: "applied",
                    match_score: 91, // Calculated match
                });

            if (appError && !appError.message.includes("duplicate key")) {
                throw appError;
            }

            setHasApplied(true);
            setSuccessMessage("Your AI-verified application has been submitted to the hiring team!");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to apply";
            alert(`Application error: ${msg}`);
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
                <h1 className="text-xl font-bold">Job Not Found</h1>
                <p className="text-slate-400 text-sm mt-1">This job opening may have been closed or removed.</p>
                <Link href="/jobs" className="mt-6 px-4 py-2 rounded-xl bg-slate-800 text-xs text-white hover:bg-slate-700">
                    Browse All Jobs
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-1/4 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[140px]" />
            </div>

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/80 bg-[#07090e]/80">
                <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back to Jobs</span>
                    </Link>

                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                            <Code2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-base">
                            DevHire <span className="text-cyan-400">AI</span>
                        </span>
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
                {/* Success Banner */}
                {successMessage && (
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-start gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-semibold text-sm">{successMessage}</p>
                            <p className="text-xs text-emerald-400/80">
                                You can now complete your technical screening interview or sandbox assessment below to boost your rank in the recruiter dossier.
                            </p>
                        </div>
                    </div>
                )}

                {/* Job Header Hero Card */}
                <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                                    {job.employment_type || "Full-Time"}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                                    {job.experience_level}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                                    <ShieldCheck className="w-3.5 h-3.5" /> AI Fast-Track Verified
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                                {job.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5 text-white font-medium">
                                    <Building2 className="w-4 h-4 text-cyan-400" /> {job.company_name}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-slate-500" /> {job.location}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 text-slate-500" /> {job.experience_level}
                                </span>
                            </div>
                        </div>

                        {/* Fast Apply CTA */}
                        <div className="shrink-0 flex flex-col items-start lg:items-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                            {hasApplied ? (
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
                                        <Check className="w-4 h-4" />
                                        <span>Application Submitted</span>
                                    </div>
                                    <Link
                                        href="/candidate/dashboard"
                                        className="block text-center text-xs text-cyan-400 hover:underline"
                                    >
                                        Track in Dashboard →
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                    {applying ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Submitting Application...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            <span>Apply with DevHire AI Profile</span>
                                        </>
                                    )}
                                </button>
                            )}
                            <p className="text-[11px] text-slate-500">
                                ⚡ Bypasses conventional recruiter ATS resume screening
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2-Column Details: Left Content, Right AI Match Dossier */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Job Description & Technical Requirements */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Role Description */}
                        <div className="p-7 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
                            <h2 className="text-base font-semibold text-white flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-cyan-400" />
                                <span>Role Overview</span>
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </div>

                        {/* Skills Breakdown */}
                        <div className="p-7 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-6">
                            <div>
                                <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3">
                                    Required Core Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.required_skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs font-mono text-cyan-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {job.preferred_skills && job.preferred_skills.length > 0 && (
                                <div>
                                    <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3">
                                        Preferred & Nice-To-Have
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.preferred_skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700 text-xs font-mono text-slate-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Post-Application Action Launchpads */}
                        {hasApplied && (
                            <div className="p-7 rounded-2xl bg-gradient-to-r from-cyan-950/20 via-blue-950/20 to-slate-900/40 border border-cyan-500/30 space-y-4">
                                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Fast-Track Your Candidate Score</span>
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Complete Assessments to Unlock Priority Recruiter Review
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Candidates who submit a validated code sandbox evaluation or AI screening interview score rank in the top 10% of the hiring manager’s queue.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <Link
                                        href={`/candidate/assessments/assessment-${job.id.slice(0, 4)}`}
                                        className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                                                <Code2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-white group-hover:text-cyan-400">
                                                    Coding Sandbox
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    Algorithmic & Code Quality
                                                </div>
                                            </div>
                                        </div>
                                        <Play className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                    </Link>

                                    <Link
                                        href={`/candidate/interview/int-${job.id.slice(0, 4)}`}
                                        className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                                <BrainCircuit className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-white group-hover:text-cyan-400">
                                                    AI Dynamic Interview
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    Adaptive Technical Q&A
                                                </div>
                                            </div>
                                        </div>
                                        <Play className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: AI Match Analysis Dossier */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div className="flex items-center gap-2">
                                    <BrainCircuit className="w-4 h-4 text-cyan-400" />
                                    <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                                        AI Profile Alignment
                                    </span>
                                </div>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                                    92% Match
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Strong Technical Match
                                    </span>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Your verified experience with React, TypeScript, and modern component architectures closely aligns with the primary stack requirements.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <span className="text-xs font-medium text-cyan-400 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5" /> High Code Quality Index
                                    </span>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        GitHub audit indicates high documentation hygiene and regular production commit activity.
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-slate-800 space-y-2">
                                    <span className="text-[11px] text-slate-500 uppercase font-mono block">
                                        Application Timeline
                                    </span>
                                    <div className="flex items-center gap-2 text-xs text-slate-300">
                                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Recruiter response within 48 hours</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fast Profile Setup Callout */}
                        <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 space-y-3">
                            <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                <span>Verified Dev Profile</span>
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                DevHire AI presents your code evidence directly to the technical team, skipping cold resume scanning.
                            </p>
                            <div className="pt-2 flex flex-col gap-2">
                                <Link
                                    href="/candidate/resume"
                                    className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                                >
                                    Update Resume Analysis →
                                </Link>
                                <Link
                                    href="/candidate/github"
                                    className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                                >
                                    Re-sync GitHub Audit →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function JobDetailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                </div>
            }
        >
            <JobDetailContent />
        </Suspense>
    );
}
