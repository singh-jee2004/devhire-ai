"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Code2,
    FileCheck2,
    GitBranch,
    Bot,
    Terminal,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    ChevronLeft,
    Building2,
    User,
    Mail,
    MapPin,
    Briefcase,
    AlertCircle,
    Clock,
    TrendingUp,
    Star,
    Check,
    X,
    ExternalLink,
    ShieldCheck,
} from "lucide-react";

interface CandidateDossier {
    id: string;
    name: string;
    email: string;
    location: string;
    role: string;
    experienceLevel: string;
    status: "applied" | "screening" | "assessment" | "interview" | "shortlisted" | "hired" | "rejected";
    matchScore: number;
    signals: {
        skillMatch: number;      // 35%
        experience: number;      // 20%
        projectRelevance: number;// 15%
        githubEvidence: number;  // 10%
        assessment: number;      // 10%
        interview: number;       // 5%
    };
    skills: { name: string; confidence: number; category: string }[];
    matchedRequirements: string[];
    gaps: string[];
    githubSummary: {
        score: number;
        reposAudited: number;
        primaryLang: string;
        architectureNotes: string;
    };
    assessmentSummary: {
        score: number;
        testCasesPassed: string;
        codeComplexity: string;
    };
    interviewSummary: {
        score: number;
        technicalDepth: string;
        communication: string;
    };
}

function CandidateDetailContent() {
    const params = useParams();
    const router = useRouter();
    const candidateId = params.id as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "resume" | "github" | "assessment" | "interview">("overview");

    // Dynamic dossier with high-fidelity candidate intelligence per PRD Section 23
    const [dossier, setDossier] = useState<CandidateDossier>({
        id: candidateId,
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        location: "Bangalore, India (Remote)",
        role: "Senior Full Stack Engineer",
        experienceLevel: "Senior Developer (5+ yrs)",
        status: "shortlisted",
        matchScore: 92,
        signals: {
            skillMatch: 95,
            experience: 90,
            projectRelevance: 92,
            githubEvidence: 88,
            assessment: 91,
            interview: 89,
        },
        skills: [
            { name: "React 19", confidence: 96, category: "Frontend" },
            { name: "TypeScript", confidence: 94, category: "Languages" },
            { name: "Node.js", confidence: 91, category: "Backend" },
            { name: "Next.js", confidence: 93, category: "Frontend" },
            { name: "PostgreSQL", confidence: 88, category: "Database" },
            { name: "Docker", confidence: 79, category: "DevOps" },
        ],
        matchedRequirements: [
            "5+ years building production React & Node.js web applications",
            "Proficient in TypeScript strict typing and modular design patterns",
            "Demonstrated experience designing relational schemas in PostgreSQL",
            "Authored 3 open-source utility libraries on GitHub with active stars",
        ],
        gaps: [
            "Limited direct exposure to Kubernetes orchestration (Docker baseline verified)",
            "Distributed cache clustering (Redis) could benefit from deeper exploration",
        ],
        githubSummary: {
            score: 88,
            reposAudited: 8,
            primaryLang: "TypeScript",
            architectureNotes:
                "High quality modular monorepo architecture. Clean separation between domain logic and UI. 92% test coverage in core repository.",
        },
        assessmentSummary: {
            score: 91,
            testCasesPassed: "12 / 12 Test Cases Passed (100%)",
            codeComplexity: "O(N) Time Complexity • Minimal memory overhead",
        },
        interviewSummary: {
            score: 89,
            technicalDepth: "Exemplary explanation of concurrent WebSocket connections and state synchronization.",
            communication: "Clear, articulated architectural trade-offs.",
        },
    });

    const handleStatusChange = async (newStatus: CandidateDossier["status"]) => {
        setDossier((prev) => ({ ...prev, status: newStatus }));
        try {
            await supabase
                .from("applications")
                .update({ status: newStatus })
                .eq("id", candidateId);
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-1/4 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[140px]" />
            </div>

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/80 bg-[#07090e]/80">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <Link
                        href="/recruiter/dashboard"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">Application Stage:</span>
                        <select
                            value={dossier.status}
                            onChange={(e) => handleStatusChange(e.target.value as CandidateDossier["status"])}
                            className="bg-slate-900 border border-slate-700 text-xs text-cyan-400 font-mono py-1.5 px-3 rounded-xl focus:outline-none focus:border-cyan-500 capitalize"
                        >
                            <option value="applied">Applied</option>
                            <option value="screening">AI Screening</option>
                            <option value="assessment">Assessment</option>
                            <option value="interview">Interview</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                {/* Candidate Profile Header Card */}
                <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                    <div className="flex items-center gap-5">
                        <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-cyan-500/20 ring-2 ring-white/10">
                            {dossier.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-white tracking-tight">{dossier.name}</h1>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono capitalize">
                                    {dossier.status}
                                </span>
                            </div>
                            <p className="text-sm text-cyan-400 font-medium">{dossier.role}</p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {dossier.location}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5 text-slate-500" /> {dossier.experienceLevel}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {dossier.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* AI Match Score Radial Summary (PRD Section 17 & 23) */}
                    <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl flex items-center gap-6 shrink-0">
                        <div className="text-right space-y-1">
                            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                                Overall AI Match
                            </span>
                            <span className="text-4xl font-black text-cyan-400">{dossier.matchScore}%</span>
                            <span className="text-[11px] text-emerald-400 block font-medium">
                                Recommendation: SHORTLIST
                            </span>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                            ✓
                        </div>
                    </div>
                </div>

                {/* 6-Part Signal Breakdown Grid (PRD Section 17) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block mb-1">Skills (35%)</span>
                        <span className="text-lg font-bold text-white">{dossier.signals.skillMatch}%</span>
                        <div className="w-full bg-slate-800 h-1 rounded-full mt-2">
                            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${dossier.signals.skillMatch}%` }} />
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block mb-1">Experience (20%)</span>
                        <span className="text-lg font-bold text-white">{dossier.signals.experience}%</span>
                        <div className="w-full bg-slate-800 h-1 rounded-full mt-2">
                            <div className="bg-blue-400 h-full rounded-full" style={{ width: `${dossier.signals.experience}%` }} />
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block mb-1">Projects (15%)</span>
                        <span className="text-lg font-bold text-white">{dossier.signals.projectRelevance}%</span>
                        <div className="w-full bg-slate-800 h-1 rounded-full mt-2">
                            <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${dossier.signals.projectRelevance}%` }} />
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block mb-1">GitHub (10%)</span>
                        <span className="text-lg font-bold text-white">{dossier.signals.githubEvidence}%</span>
                        <div className="w-full bg-slate-800 h-1 rounded-full mt-2">
                            <div className="bg-purple-400 h-full rounded-full" style={{ width: `${dossier.signals.githubEvidence}%` }} />
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block mb-1">Coding (10%)</span>
                        <span className="text-lg font-bold text-white">{dossier.signals.assessment}%</span>
                        <div className="w-full bg-slate-800 h-1 rounded-full mt-2">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${dossier.signals.assessment}%` }} />
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block mb-1">Interview (5%)</span>
                        <span className="text-lg font-bold text-white">{dossier.signals.interview}%</span>
                        <div className="w-full bg-slate-800 h-1 rounded-full mt-2">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${dossier.signals.interview}%` }} />
                        </div>
                    </div>
                </div>

                {/* Explainable AI Match Analysis (PRD Section 42) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-800/30 space-y-3">
                        <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                            <Check className="w-4 h-4" /> Why They Match (Verified Signals)
                        </h3>
                        <ul className="space-y-2 text-xs text-slate-300">
                            {dossier.matchedRequirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/30 space-y-3">
                        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Gaps & Areas to Explore
                        </h3>
                        <ul className="space-y-2 text-xs text-slate-300">
                            {dossier.gaps.map((gap, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-amber-400 font-bold">•</span>
                                    <span>{gap}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Deep-Dive Intelligence Tabs */}
                <div className="space-y-6">
                    <div className="flex border-b border-slate-800 gap-6 text-sm font-medium">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`pb-3 border-b-2 transition-all ${activeTab === "overview"
                                    ? "border-cyan-400 text-cyan-400 font-semibold"
                                    : "border-transparent text-slate-400 hover:text-white"
                                }`}
                        >
                            Extracted Skills
                        </button>
                        <button
                            onClick={() => setActiveTab("github")}
                            className={`pb-3 border-b-2 transition-all ${activeTab === "github"
                                    ? "border-purple-400 text-purple-400 font-semibold"
                                    : "border-transparent text-slate-400 hover:text-white"
                                }`}
                        >
                            GitHub Code Audit
                        </button>
                        <button
                            onClick={() => setActiveTab("assessment")}
                            className={`pb-3 border-b-2 transition-all ${activeTab === "assessment"
                                    ? "border-amber-400 text-amber-400 font-semibold"
                                    : "border-transparent text-slate-400 hover:text-white"
                                }`}
                        >
                            Coding Assessment
                        </button>
                        <button
                            onClick={() => setActiveTab("interview")}
                            className={`pb-3 border-b-2 transition-all ${activeTab === "interview"
                                    ? "border-emerald-400 text-emerald-400 font-semibold"
                                    : "border-transparent text-slate-400 hover:text-white"
                                }`}
                        >
                            AI Interview Evaluation
                        </button>
                    </div>

                    {/* Tab 1: Skills Matrix */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dossier.skills.map((s) => (
                                <div key={s.name} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-white">{s.name}</span>
                                        <span className="font-mono text-cyan-400 font-bold">{s.confidence}% Confidence</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${s.confidence}%` }} />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono block">Domain: {s.category}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tab 2: GitHub Audit */}
                    {activeTab === "github" && (
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white text-base">Codebase Hygiene & Architecture</h4>
                                    <p className="text-xs text-slate-400">
                                        Audited {dossier.githubSummary.reposAudited} repositories • Primary Language: {dossier.githubSummary.primaryLang}
                                    </p>
                                </div>
                                <span className="text-2xl font-black text-purple-400">{dossier.githubSummary.score}/100</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                                {dossier.githubSummary.architectureNotes}
                            </p>
                        </div>
                    )}

                    {/* Tab 3: Coding Assessment */}
                    {activeTab === "assessment" && (
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white text-base">Algorithm & Problem Solving Sandbox</h4>
                                    <p className="text-xs text-slate-400">{dossier.assessmentSummary.testCasesPassed}</p>
                                </div>
                                <span className="text-2xl font-black text-amber-400">{dossier.assessmentSummary.score}/100</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-xs text-amber-300">
                                Performance: {dossier.assessmentSummary.codeComplexity}
                            </div>
                        </div>
                    )}

                    {/* Tab 4: AI Interview Evaluation */}
                    {activeTab === "interview" && (
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white text-base">Conversational Technical Assessment</h4>
                                    <p className="text-xs text-slate-400">{dossier.interviewSummary.communication}</p>
                                </div>
                                <span className="text-2xl font-black text-emerald-400">{dossier.interviewSummary.score}/100</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                                {dossier.interviewSummary.technicalDepth}
                            </p>
                        </div>
                    )}
                </div>

                {/* Human Decision Action Footer (PRD Section 41) */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                        <strong>Human-in-the-Loop:</strong> AI recommendations are decision-support only. Final hiring progress is controlled by the recruiter.
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => handleStatusChange("rejected")}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => handleStatusChange("shortlisted")}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
                        >
                            Shortlist Candidate
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CandidateDetailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-slate-400 text-sm">
                    Loading candidate dossier...
                </div>
            }
        >
            <CandidateDetailContent />
        </Suspense>
    );
}
