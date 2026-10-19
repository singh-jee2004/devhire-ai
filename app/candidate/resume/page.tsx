"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Code2,
    UploadCloud,
    FileCheck2,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    TrendingUp,
    Briefcase,
    AlertCircle,
    Loader2,
    Layers,
    ChevronLeft,
} from "lucide-react";

interface ParsedSkill {
    name: string;
    category: string;
    confidence: number;
}

interface IntelligenceData {
    name: string;
    experienceLevel: string;
    overallScore: number;
    skills: ParsedSkill[];
    experience: { role: string; company: string; period: string; summary: string }[];
    strengths: string[];
    areasToImprove: string[];
}

export default function ResumePage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IntelligenceData | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadAndAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        setErrorMsg(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/ai/parse-resume", {
                method: "POST",
                body: formData,
            });

            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.error || "Failed to analyze resume");
            }

            setData(json.intelligence);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to process resume";
            setErrorMsg(message);
        } finally {
            setLoading(false);
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
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <Link href="/candidate/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-xl">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Parser Active</span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
                {/* Title */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        AI Resume Intelligence
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Upload your technical resume. Our AI extracts your core technologies, determines
                        verified confidence levels, and maps you to open hiring specifications.
                    </p>
                </div>

                {/* Upload Dropzone */}
                <div className="p-8 rounded-3xl bg-slate-900/40 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 transition-all text-center backdrop-blur-xl relative">
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />

                    <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <UploadCloud className="w-8 h-8" />
                        </div>

                        {file ? (
                            <div>
                                <p className="font-semibold text-white text-base">{file.name}</p>
                                <p className="text-xs text-cyan-400 font-mono mt-1">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="font-semibold text-white text-base">
                                    Drag and drop your resume here, or <span className="text-cyan-400 underline">browse</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Supports PDF & DOCX up to 10MB</p>
                            </div>
                        )}
                    </div>
                </div>

                {errorMsg && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleUploadAndAnalyze}
                        disabled={!file || loading}
                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2.5 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-40"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Extracting Skills & Confidence Scores...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Run AI Analysis</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Analyzed Intelligence Dossier */}
                {data && (
                    <div className="pt-8 border-t border-slate-800/80 space-y-8 animate-in fade-in duration-500">
                        {/* Candidate Summary Card */}
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                                    Analyzed Profile
                                </span>
                                <h3 className="text-xl font-bold text-white">{data.name}</h3>
                                <p className="text-xs text-slate-400">
                                    Estimated Level: <span className="text-white font-medium">{data.experienceLevel}</span>
                                </p>
                            </div>

                            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
                                <span className="text-xs font-mono text-slate-400 uppercase block">Resume Score</span>
                                <span className="text-3xl font-black text-cyan-400">{data.overallScore}%</span>
                            </div>
                        </div>

                        {/* Extracted Skills with Confidence Matrix */}
                        <div className="space-y-4">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <FileCheck2 className="w-5 h-5 text-cyan-400" />
                                <span>Extracted Technical Competencies</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {data.skills.map((skill) => (
                                    <div
                                        key={skill.name}
                                        className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2"
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-white">{skill.name}</span>
                                            <span className="font-mono text-cyan-400 font-bold">{skill.confidence}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-cyan-400 h-full rounded-full"
                                                style={{ width: `${skill.confidence}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-mono block">
                                            Category: {skill.category}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Strengths & Areas to Improve */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-800/30 space-y-3">
                                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Engineering Strengths
                                </h4>
                                <ul className="space-y-2 text-xs text-slate-300">
                                    {data.strengths.map((str, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-emerald-400 font-bold">•</span>
                                            <span>{str}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/30 space-y-3">
                                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Areas to Explore / Upskill
                                </h4>
                                <ul className="space-y-2 text-xs text-slate-300">
                                    {data.areasToImprove.map((area, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-amber-400 font-bold">•</span>
                                            <span>{area}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
