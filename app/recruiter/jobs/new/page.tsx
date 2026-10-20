"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Sparkles,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Wand2,
  CheckCircle2,
  LogIn,
} from "lucide-react";

export default function NewJobPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("TechCorp Labs");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level");
  const [location, setLocation] = useState("Remote");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("React, TypeScript, Node.js");
  const [preferredSkills, setPreferredSkills] = useState("Next.js, PostgreSQL, Docker");

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user?.user_metadata?.company_name) {
        setCompanyName(user.user_metadata.company_name);
      }
    }
    checkUser();
  }, [supabase]);

  const handleGenerateWithAI = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/ai/generate-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to generate job");

      const job = json.job;
      setTitle(job.title);
      setExperienceLevel(job.experienceLevel);
      setLocation(job.location);
      setDescription(job.description);
      setRequiredSkills(job.requiredSkills.join(", "));
      setPreferredSkills(job.preferredSkills.join(", "));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error with AI Generator";
      setErrorMsg(message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setErrorMsg(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMsg(
          "You are not signed in. You must be signed in with an account to publish jobs to Supabase."
        );
        setPublishing(false);
        return;
      }

      // Ensure profile exists in public.profiles to satisfy foreign key constraint
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || "Recruiter",
        email: user.email || "",
        role: "recruiter",
        company_name: companyName,
      });

      // Save to Supabase `jobs` table
      const { error: insertError } = await supabase.from("jobs").insert({
        recruiter_id: user.id,
        company_name: companyName,
        title,
        description,
        location,
        experience_level: experienceLevel,
        required_skills: requiredSkills.split(",").map((s) => s.trim()),
        preferred_skills: preferredSkills.split(",").map((s) => s.trim()),
        status: "published",
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      router.push("/recruiter/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to publish job";
      setErrorMsg(message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/3 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/80 bg-[#07090e]/80">
        <div className="max-w-5xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link
            href="/recruiter/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Job Generator</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create a New Position
          </h1>
          <p className="text-sm text-slate-400">
            Use the natural language AI generator or fill out the technical requirements manually.
          </p>
        </div>

        {/* Warning if not logged in */}
        {!currentUser && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                You are currently browsing as a guest. Please sign in to save and manage jobs under your account.
              </span>
            </div>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-sans flex items-center gap-1.5 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          </div>
        )}

        {/* AI Quick Generator Prompt Box (PRD Section 15) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-blue-950/30 border border-cyan-800/40 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <Wand2 className="w-4 h-4 text-cyan-400" />
            <span>AI Auto-Generator: Describe who you need to hire</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g. "I need a junior React developer with Node.js and PostgreSQL experience"'
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="button"
              onClick={handleGenerateWithAI}
              disabled={generating || !prompt.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-40 shrink-0"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Spec...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Specs</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Editable Job Form */}
        <form onSubmit={handlePublishJob} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Job Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Full Stack Engineer"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Experience Level</label>
              <input
                type="text"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                placeholder="Junior / Mid / Senior"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote / San Francisco"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              required
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Preferred Skills (comma separated)
            </label>
            <input
              type="text"
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
              placeholder="Next.js, PostgreSQL, Docker"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Job Description</label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed responsibilities and engineering requirements..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Link
              href="/recruiter/dashboard"
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={publishing || !title}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Publish Position</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
