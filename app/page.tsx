import Link from "next/link";
import {
  Code2,
  FileCheck2,
  GitBranch,
  Bot,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Terminal,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[35%] -left-32 w-[500px] h-[400px] bg-purple-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/80 bg-[#07090e]/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                DevHire <span className="text-cyan-400">AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Candidate Intelligence
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Platform</a>
            <a href="#intelligence" className="hover:text-cyan-400 transition-colors">AI Engine</a>
            <a href="#flow" className="hover:text-cyan-400 transition-colors">How it Works</a>
            <Link href="/jobs" className="hover:text-cyan-400 transition-colors">Explore Jobs</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold px-4.5 py-2.2 rounded-xl transition-all shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>The AI Candidate Intelligence Layer for Tech Hiring</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1] mb-6">
            Hire Developers Based on What They Can{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Actually Build
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-10">
            Automate screening with authentic signals. AI-powered technical resumes, GitHub
            codebase auditing, sandbox coding challenges, and dynamic voice/text interviews in one
            unbiased platform.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/signup?role=recruiter"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.02]"
            >
              <span>Find Developers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signup?role=candidate"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-all hover:border-slate-600"
            >
              <span>Find Jobs</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-16 pt-12 border-t border-slate-800/80 w-full max-w-4xl text-left">
            <div>
              <div className="text-3xl font-bold text-white tracking-tight">85%</div>
              <div className="text-xs text-slate-400 mt-1">Faster Screening Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400 tracking-tight">360°</div>
              <div className="text-xs text-slate-400 mt-1">Evidence-Based Signals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white tracking-tight">0%</div>
              <div className="text-xs text-slate-400 mt-1">Protected Attribute Bias</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 tracking-tight">100%</div>
              <div className="text-xs text-slate-400 mt-1">Human-in-the-Loop</div>
            </div>
          </div>
        </div>

        {/* Live Dossier Preview */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/80">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 font-bold text-sm">
                JD
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Rahul Sharma</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    Top 5% Match
                  </span>
                </div>
                <p className="text-xs text-slate-400">Target Role: Senior Full Stack Engineer (React + Node.js)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider block">AI Match Score</span>
                <span className="text-2xl font-black text-cyan-400">92/100</span>
              </div>
              <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                ✓
              </div>
            </div>
          </div>

          {/* Signals Breakdown Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-5">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-blue-400" /> Resume Score
                </span>
                <span className="font-mono text-white font-semibold">95%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[95%]" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 truncate">React 94%, Node.js 91%, Postgres</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-purple-400" /> GitHub Audit
                </span>
                <span className="font-mono text-white font-semibold">88%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[88%]" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 truncate">Clean modular architecture & docs</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" /> Coding Challenge
                </span>
                <span className="font-mono text-white font-semibold">91%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[91%]" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 truncate">12/12 Test Cases passed (O(N) time)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-emerald-400" /> AI Interview
                </span>
                <span className="font-mono text-white font-semibold">89%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[89%]" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 truncate">Strong answers on concurrency</p>
            </div>
          </div>

          {/* AI Evidence Insight */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-200">
              <BrainCircuit className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong>AI Recommendation:</strong> Strong match. High proficiency in backend API
                patterns and React 19. Minor area to explore: Distributed caching.
              </span>
            </div>
            <span className="text-cyan-400 font-mono shrink-0 underline cursor-pointer">
              View Full Report →
            </span>
          </div>
        </div>
      </section>

      {/* 5 Core Pillars Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-mono text-cyan-400 tracking-widest mb-3">
            Multi-Signal Intelligence
          </h2>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Beyond Keywords. True Proof of Work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Resume Intelligence</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Extracts programming languages, frameworks, cloud platforms, and achievements with
              calculated confidence percentages instead of simple keyword matching.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
              <GitBranch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">GitHub Codebase Auditing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Analyzes real project structures, architecture complexity, testing rigor, and commit
              consistency. We never equate mere commit count with developer quality.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Dynamic AI Technical Interviews</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The AI interviewer asks technical questions grounded in the candidate&apos;s specific GitHub
              projects and resume, dynamically asking follow-ups on architectural trade-offs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-6 max-w-7xl mx-auto text-slate-500 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-semibold">DevHire AI</span>
          <span>© 2026. Built for developers and modern technical teams.</span>
        </div>
        <div className="flex gap-6">
          <Link href="/jobs" className="hover:text-slate-300">Jobs</Link>
          <Link href="/login" className="hover:text-slate-300">Sign In</Link>
          <Link href="/signup" className="hover:text-slate-300">Register</Link>
        </div>
      </footer>
    </div>
  );
}
