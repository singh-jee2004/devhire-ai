"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    Code2,
    Search,
    MapPin,
    Briefcase,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Building2,
    Loader2,
} from "lucide-react";

interface Job {
    id: string;
    title: string;
    company_name: string;
    location: string;
    employment_type: string;
    experience_level: string;
    required_skills: string[];
    description: string;
    created_at: string;
}

// Fallback sample jobs so the board is immediately alive even before recruiters post
const INITIAL_SAMPLE_JOBS: Job[] = [
    {
        id: "sample-1",
        title: "Senior Full Stack Engineer (React + Node)",
        company_name: "Synthetix Labs",
        location: "Remote (Global)",
        employment_type: "Full-time",
        experience_level: "Senior",
        required_skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js"],
        description:
            "Looking for a full stack engineer with deep experience building scalable real-time architectures, distributed state, and clean APIs.",
        created_at: "Just now",
    },
    {
        id: "sample-2",
        title: "Frontend AI Engineer",
        company_name: "CognitiveFlow",
        location: "Remote (US / EU)",
        employment_type: "Full-time",
        experience_level: "Mid-Level",
        required_skills: ["Next.js", "Tailwind CSS", "TypeScript", "Vercel AI SDK", "Python"],
        description:
            "Build stunning, highly reactive interfaces powered by streaming generative models and agentic workflows.",
        created_at: "2 hours ago",
    },
    {
        id: "sample-3",
        title: "Backend Cloud Systems Engineer",
        company_name: "DataSpire Systems",
        location: "San Francisco, CA (Hybrid)",
        employment_type: "Full-time",
        experience_level: "Senior",
        required_skills: ["Go", "Kubernetes", "AWS", "gRPC", "Docker"],
        description:
            "Design high-throughput ingestion pipelines and microservices processing millions of telemetry events every second.",
        created_at: "1 day ago",
    },
];

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>(INITIAL_SAMPLE_JOBS);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [loading, setLoading] = useState(true);

    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const { data, error } = await supabase
                    .from("jobs")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (data && data.length > 0) {
                    setJobs(data);
                } else if (error) {
                    console.error("Jobs query error:", error.message);
                }
            } catch (err) {
                console.error("Failed to load jobs:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchJobs();
    }, [supabase]);

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.required_skills.some((skill) =>
                skill.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesLevel =
            selectedLevel === "all" ||
            job.experience_level.toLowerCase() === selectedLevel.toLowerCase();

        return matchesSearch && matchesLevel;
    });

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[140px]" />
            </div>

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/80 bg-[#07090e]/80">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                            DevHire <span className="text-cyan-400">AI</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-4.5 py-2.2 rounded-xl transition-all shadow-md shadow-cyan-500/20"
                        >
                            Join Platform
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero & Search Header */}
            <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto">
                <div className="max-w-3xl mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Verified Technical Openings</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Explore Developer Roles
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed">
                        Apply with your AI-verified developer profile, GitHub proof-of-work, and coding skills.
                        Skip initial recruiter screening filters.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-2 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-2xl">
                    <div className="sm:col-span-8 relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by role, company, or tech (e.g. React, Go, Next.js)..."
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>

                    <div className="sm:col-span-4 flex gap-2">
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors"
                        >
                            <option value="all">All Experience Levels</option>
                            <option value="entry">Junior (0-2 yrs)</option>
                            <option value="mid-level">Mid-Level (2-5 yrs)</option>
                            <option value="senior">Senior (5+ yrs)</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Jobs Listing */}
            <section className="pb-24 px-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-xs uppercase font-mono tracking-wider text-slate-400">
                        Showing <span className="text-white font-semibold">{filteredJobs.length}</span> verified positions
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                        <span className="text-xs font-mono">Loading positions...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="space-y-3 max-w-3xl">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                            {job.title}
                                        </h2>
                                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                                            {job.employment_type}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                                            <Building2 className="w-3.5 h-3.5 text-cyan-400" /> {job.company_name}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Briefcase className="w-3.5 h-3.5 text-slate-500" /> {job.experience_level}
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                        {job.description}
                                    </p>

                                    {/* Skill Badges */}
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {job.required_skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2.5 py-1 rounded-lg bg-cyan-950/30 border border-cyan-800/30 text-[11px] text-cyan-300 font-mono"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                                    <div className="text-right hidden sm:block">
                                        <span className="text-[11px] text-slate-500 block">AI Screening</span>
                                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Instant Match
                                        </span>
                                    </div>

                                    <Link
                                        href={`/jobs/${job.id}`}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 text-white hover:text-slate-950 text-xs font-semibold transition-all group-hover:shadow-md group-hover:shadow-cyan-500/10"
                                    >
                                        <span>Apply with AI Profile</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {filteredJobs.length === 0 && (
                            <div className="text-center py-16 bg-slate-900/20 border border-slate-800/60 rounded-2xl">
                                <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                                <h3 className="text-sm font-semibold text-white">No jobs matched your search</h3>
                                <p className="text-xs text-slate-500 mt-1">Try adjusting your keywords or experience filter.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
