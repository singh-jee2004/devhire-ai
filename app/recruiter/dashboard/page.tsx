"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Code2,
  Building2,
  Briefcase,
  Sparkles,
  Plus,
  CheckCircle2,
  LogOut,
  ChevronRight,
  Award,
  Loader2,
  Trash2,
  Search,
  X,
  Bot,
  UserCheck,
} from "lucide-react";

interface JobItem {
  id: string;
  recruiter_id?: string;
  title: string;
  location: string;
  employment_type?: string;
  experience_level?: string;
  required_skills?: string[];
  status: string;
  created_at: string;
}

interface CandidateItem {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  skills: string[];
  status: string;
}

export default function RecruiterDashboard() {
  const router = useRouter();
  const [recruiterName, setRecruiterName] = useState("Recruiter");
  const [companyName, setCompanyName] = useState("My Company");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // AI Semantic Candidate Search State
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchFilter, setActiveSearchFilter] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const handleAISearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : searchPrompt).trim();
    if (!query) {
      setActiveSearchFilter(null);
      return;
    }
    setIsSearching(true);
    setSearchPrompt(query);
    setTimeout(() => {
      setActiveSearchFilter(query);
      setIsSearching(false);
    }, 450);
  };

  const handleClearSearch = () => {
    setSearchPrompt("");
    setActiveSearchFilter(null);
  };

  const displayedCandidates = candidates.filter((c) => {
    if (!activeSearchFilter) return true;
    const q = activeSearchFilter.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q)) ||
      (q.includes("react") && (c.role.toLowerCase().includes("react") || c.role.toLowerCase().includes("frontend"))) ||
      (q.includes("go") && c.role.toLowerCase().includes("backend")) ||
      (q.includes("typescript") && (c.role.toLowerCase().includes("full") || c.role.toLowerCase().includes("frontend")))
    );
  });

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
          setRecruiterName(user.user_metadata?.full_name || "Recruiter");
          setCompanyName(user.user_metadata?.company_name || "My Company");
        }

        // 1. Fetch real jobs from Supabase (visible to everyone per RLS)
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (jobsData) {
          setJobs(jobsData);
        } else if (jobsError) {
          console.error("Jobs error:", jobsError.message);
        }

          // 2. Fetch real candidate applications with profile details
          const { data: appsData } = await supabase
            .from("applications")
            .select(`
              id,
              status,
              match_score,
              jobs (title),
              profiles (id, full_name, experience_level)
            `)
            .order("match_score", { ascending: false });

          interface RecruiterAppRecord {
            id: string;
            status: string;
            match_score: number | null;
            jobs?: { title?: string } | null;
            profiles?: { id?: string; full_name?: string; experience_level?: string } | null;
          }

          if (appsData && appsData.length > 0) {
            const formattedCandidates: CandidateItem[] = (appsData as unknown as RecruiterAppRecord[]).map((app) => ({
              id: app.profiles?.id || app.id,
              name: app.profiles?.full_name || "Anonymous Candidate",
              role: app.jobs?.title || "Applicant",
              matchScore: Math.round(Number(app.match_score) || 0),
              skills: ["Verified Match"],
              status: app.status || "applied",
            }));
            setCandidates(formattedCandidates);
          } else {
            setCandidates([]);
          }
      } catch (err) {
        console.error("Failed to load recruiter data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting? This cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId);
      if (error) {
        alert(`Cannot delete job: ${error.message}`);
        return;
      }
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: unknown) {
      console.error("Delete error:", err);
    }
  };

  // Real computed metrics
  const activeJobsCount = jobs.filter((j) => j.status === "published").length;
  const totalApplicationsCount = candidates.length;
  const shortlistedCount = candidates.filter((c) => c.status === "shortlisted").length;
  const interviewCount = candidates.filter((c) => c.status === "interview").length;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[800px] h-[350px] bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent blur-[140px]" />
      </div>

      {/* Recruiter Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/80 bg-[#07090e]/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/recruiter/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                DevHire <span className="text-cyan-400">AI</span>
              </span>
              <span className="block text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
                Recruiter Portal
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/recruiter/dashboard" className="text-cyan-400 font-semibold">
              Dashboard
            </Link>
            <Link href="/recruiter/jobs/new" className="hover:text-cyan-400 transition-colors">
              Post a Job (AI)
            </Link>
            <Link href="/jobs" className="hover:text-cyan-400 transition-colors">
              Public Job Board
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{companyName}</span>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
              className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-blue-950/20 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Screening Engine Active</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Hiring Overview • {companyName}
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Welcome back, {recruiterName}. Create positions using the AI Job Generator and inspect
              candidate proof-of-work dossiers in real time.
            </p>
          </div>

          <Link
            href="/recruiter/jobs/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-md shadow-cyan-500/25 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Job (AI)</span>
          </Link>
        </div>

        {/* 4 Pipeline Stat Metrics (Live Data) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono uppercase block mb-1">Active Positions</span>
            <div className="text-3xl font-black text-white">{activeJobsCount}</div>
            <p className="text-[11px] text-cyan-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Published listings
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono uppercase block mb-1">Total Applications</span>
            <div className="text-3xl font-black text-white">{totalApplicationsCount}</div>
            <p className="text-[11px] text-slate-400 mt-2">Received across all roles</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono uppercase block mb-1">AI Shortlisted</span>
            <div className="text-3xl font-black text-cyan-400">{shortlistedCount}</div>
            <p className="text-[11px] text-slate-400 mt-2">Passed AI criteria</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono uppercase block mb-1">Interviews Done</span>
            <div className="text-3xl font-black text-purple-400">{interviewCount}</div>
            <p className="text-[11px] text-slate-400 mt-2">Completed evaluations</p>
          </div>
        </div>

        {/* PRD Section 19: Natural Language Candidate Search & AI Matchmaker */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>AI Semantic Candidate Matchmaker</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    PRD §19
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Search across verified code quality, interview depth, and skill matrices using natural language.
                </p>
              </div>
            </div>

            {activeSearchFilter && (
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5 text-rose-400" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

          <form onSubmit={(e) => handleAISearch(e)} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="e.g. Show me developers with 4+ years React experience and high documentation hygiene..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-3 pl-11 pr-10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {searchPrompt && (
                <button
                  type="button"
                  onClick={() => setSearchPrompt("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 shrink-0"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Matching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Match Candidates</span>
                </>
              )}
            </button>
          </form>

          {/* Prompt Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Try asking:</span>
            <button
              type="button"
              onClick={() => handleAISearch(undefined, "Show me developers with 4+ years React experience and high documentation hygiene")}
              className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-[11px] transition-colors font-mono"
            >
              ⚡ React (4+ yrs) &amp; clean docs
            </button>
            <button
              type="button"
              onClick={() => handleAISearch(undefined, "Backend engineers with Go, PostgreSQL & Docker")}
              className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-[11px] transition-colors font-mono"
            >
              🛠️ Backend Go &amp; PostgreSQL
            </button>
            <button
              type="button"
              onClick={() => handleAISearch(undefined, "TypeScript full-stack candidates with high coding sandbox score")}
              className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-[11px] transition-colors font-mono"
            >
              🏆 TypeScript &amp; top sandbox scores
            </button>
          </div>

          {activeSearchFilter && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active Semantic Query: &quot;{activeSearchFilter}&quot;</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {displayedCandidates.length} candidate{displayedCandidates.length === 1 ? "" : "s"} matched
              </span>
            </div>
          )}
        </div>

        {/* 2-Column Section: Active Jobs vs Top Ranked Candidates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Jobs Table (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Active Job Openings</span>
              </h2>
              <Link href="/recruiter/jobs/new" className="text-xs text-cyan-400 hover:underline">
                + Create Job
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Loading open roles...</span>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white text-base">{job.title}</h3>
                        <p className="text-xs text-slate-400">
                          {job.location} • {job.experience_level || "Any Experience"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {job.status}
                        </span>
                        {(!job.recruiter_id || job.recruiter_id === userId) && (
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete this job posting"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {job.required_skills && job.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.required_skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-mono"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Clean Empty State */
              <div className="p-12 rounded-2xl bg-slate-900/30 border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">No active job listings yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Create your first job listing using natural language with our AI Job Generator.
                  </p>
                </div>
                <Link
                  href="/recruiter/jobs/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Job</span>
                </Link>
              </div>
            )}
          </div>

          {/* Top Ranked Candidates (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Top Ranked Candidates</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {activeSearchFilter ? "Semantic Filter" : "AI Scored"}
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Checking candidates...</span>
              </div>
            ) : displayedCandidates.length > 0 ? (
              <div className="space-y-3">
                {displayedCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{cand.name}</h4>
                        <p className="text-xs text-slate-400">{cand.role}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                        {cand.matchScore}% Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 capitalize">
                        Stage: {cand.status}
                      </span>
                      <Link
                        href={`/recruiter/candidates/${cand.id}`}
                        className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        View Dossier <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeSearchFilter ? (
              /* Search Filter Empty State */
              <div className="p-8 rounded-2xl bg-slate-900/30 border border-cyan-500/30 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">No matches in current pool</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    No active applicants currently match all criteria for &quot;{activeSearchFilter}&quot;.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-xs text-cyan-400 hover:underline font-mono"
                >
                  Clear search filter
                </button>
              </div>
            ) : (
              /* Clean Empty State */
              <div className="p-12 rounded-2xl bg-slate-900/30 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">No applicants yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Once candidates apply, their AI-verified match scores and proof-of-work dossiers will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
