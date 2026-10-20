"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Code2,
    ChevronLeft,
    User,
    Mail,
    Briefcase,
    DollarSign,
    MapPin,
    GitBranch,
    Link2,
    Globe,
    Save,
    Loader2,
    CheckCircle2,
    Sparkles,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";

function ProfileContent() {
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Profile form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [headline, setHeadline] = useState("");
    const [bio, setBio] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("mid-level");
    const [availabilityStatus, setAvailabilityStatus] = useState("actively_looking");
    const [targetCompensation, setTargetCompensation] = useState("$130,000 - $160,000 USD");
    const [workMode, setWorkMode] = useState("remote");
    const [skills, setSkills] = useState("React, Next.js, TypeScript, Tailwind CSS, Node.js");
    const [githubUrl, setGithubUrl] = useState("https://github.com/");
    const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/");
    const [portfolioUrl, setPortfolioUrl] = useState("https://");

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login?redirect=/candidate/profile");
                    return;
                }

                setEmail(user.email || "");

                // Load from public.profiles
                const { data: profile, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .maybeSingle();

                if (profile && !error) {
                    setFullName(profile.full_name || user.user_metadata?.full_name || "");
                    setHeadline(profile.headline || "Full-Stack Software Engineer & Systems Architect");
                    setBio(profile.bio || "Passionate engineer specialized in scalable web systems, clean architecture, and modern TypeScript workflows.");
                    setExperienceLevel(profile.experience_level || "mid-level");
                    setAvailabilityStatus(profile.availability_status || "actively_looking");
                    setTargetCompensation(profile.target_compensation || "$130,000 - $160,000 USD");
                    setWorkMode(profile.work_mode || "remote");
                    setSkills(profile.skills || "React, Next.js, TypeScript, Tailwind CSS, Node.js");
                    setGithubUrl(profile.github_url || "https://github.com/");
                    setLinkedinUrl(profile.linkedin_url || "https://linkedin.com/in/");
                    setPortfolioUrl(profile.portfolio_url || "https://");
                } else {
                    setFullName(user.user_metadata?.full_name || "Developer");
                    setHeadline("Full-Stack Software Engineer & Systems Architect");
                    setBio("Passionate engineer specialized in scalable web systems, clean architecture, and modern TypeScript workflows.");
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [supabase, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg(null);
        setErrorMsg(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase.from("profiles").upsert({
                id: user.id,
                full_name: fullName,
                email: email,
                headline: headline,
                bio: bio,
                experience_level: experienceLevel,
                availability_status: availabilityStatus,
                target_compensation: targetCompensation,
                work_mode: workMode,
                skills: skills,
                github_url: githubUrl,
                linkedin_url: linkedinUrl,
                portfolio_url: portfolioUrl,
                role: "candidate",
            });

            if (error) throw error;

            setSuccessMsg("Your profile and hiring availability have been updated!");
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to save profile changes";
            setErrorMsg(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-1/3 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[140px]" />
            </div>

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/80 bg-[#07090e]/80">
                <div className="max-w-5xl mx-auto px-6 h-18 flex items-center justify-between">
                    <Link
                        href="/candidate/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                            <Code2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-base">
                            DevHire <span className="text-cyan-400">AI</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono">
                            Candidate Settings
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
                {/* Header Title & CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Verified Candidate Profile</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Profile & Hiring Preferences
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Control how your proof-of-work, availability, and target salary appear to engineering recruiters.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 shrink-0"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Notifications */}
                {successMsg && (
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="text-xs font-semibold">{successMsg}</span>
                    </div>
                )}

                {errorMsg && (
                    <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-3 backdrop-blur-md">
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        <span className="text-xs font-semibold">{errorMsg}</span>
                    </div>
                )}

                {/* Form Sections */}
                <form onSubmit={handleSave} className="space-y-8">
                    {/* 1. Hiring Availability Status Card */}
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/90 space-y-4">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-cyan-400" />
                            <span>Hiring Availability</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setAvailabilityStatus("actively_looking")}
                                className={`p-4 rounded-xl border text-left transition-all ${availabilityStatus === "actively_looking"
                                    ? "bg-emerald-950/30 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10"
                                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-bold text-white">Actively Looking</span>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Ready for interviews and fast-track hiring pipelines.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setAvailabilityStatus("open_to_offers")}
                                className={`p-4 rounded-xl border text-left transition-all ${availabilityStatus === "open_to_offers"
                                    ? "bg-cyan-950/30 border-cyan-500/50 text-white shadow-md shadow-cyan-500/10"
                                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                                    <span className="text-xs font-bold text-white">Open to Offers</span>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Passively reviewing high-match opportunities only.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setAvailabilityStatus("not_looking")}
                                className={`p-4 rounded-xl border text-left transition-all ${availabilityStatus === "not_looking"
                                    ? "bg-slate-800/40 border-slate-700 text-white"
                                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                                    <span className="text-xs font-bold text-white">Not Looking</span>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Hides your profile from recruiter direct discovery.
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* 2. Personal & Professional Details */}
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/90 space-y-5">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span>Personal & Engineering Identity</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Alex Rivera"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email (Account)</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        disabled
                                        value={email}
                                        className="w-full bg-slate-950/40 border border-slate-800/60 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Professional Headline</label>
                            <input
                                type="text"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                placeholder="Staff Frontend Engineer | React 19, TypeScript & Web Performance"
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Engineering Bio</label>
                            <textarea
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Write a brief overview of your background, architectural focus, and recent work..."
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* 3. Compensation & Role Preferences */}
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/90 space-y-5">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-cyan-400" />
                            <span>Role & Compensation Targets</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Experience Level</label>
                                <select
                                    value={experienceLevel}
                                    onChange={(e) => setExperienceLevel(e.target.value)}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                >
                                    <option value="entry">Junior (0 - 2 yrs)</option>
                                    <option value="mid-level">Mid-Level (2 - 5 yrs)</option>
                                    <option value="senior">Senior (5+ yrs)</option>
                                    <option value="lead">Lead / Architect (8+ yrs)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Annual Salary</label>
                                <div className="relative">
                                    <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={targetCompensation}
                                        onChange={(e) => setTargetCompensation(e.target.value)}
                                        placeholder="$130,000 - $160,000 USD"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Preference</label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <select
                                        value={workMode}
                                        onChange={(e) => setWorkMode(e.target.value)}
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    >
                                        <option value="remote">Remote Only</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="onsite">On-Site</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Primary Tech Stack (comma separated)
                            </label>
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder="React, TypeScript, Next.js, Go, PostgreSQL, Docker"
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                            />
                        </div>
                    </div>

                    {/* 4. Portfolio & Verification Links */}
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/90 space-y-4">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                            <Globe className="w-4 h-4 text-cyan-400" />
                            <span>Evidence & Proof-of-Work Links</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub Profile</label>
                                <div className="relative">
                                    <GitBranch className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="url"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/username"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">LinkedIn Profile</label>
                                <div className="relative">
                                    <Link2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="url"
                                        value={linkedinUrl}
                                        onChange={(e) => setLinkedinUrl(e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Personal Website</label>
                                <div className="relative">
                                    <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="url"
                                        value={portfolioUrl}
                                        onChange={(e) => setPortfolioUrl(e.target.value)}
                                        placeholder="https://yourportfolio.dev"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default function CandidateProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                </div>
            }
        >
            <ProfileContent />
        </Suspense>
    );
}
