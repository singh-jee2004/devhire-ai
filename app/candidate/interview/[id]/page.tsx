"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Bot,
    Send,
    CheckCircle2,
    ChevronLeft,
    Loader2,
    TrendingUp,
    Award,
} from "lucide-react";

interface Message {
    sender: "ai" | "candidate";
    text: string;
    timestamp: string;
}

interface EvaluationResult {
    overallScore: number;
    technicalDepth: number;
    problemSolving: number;
    communication: number;
    architecture: number;
    strengths: string[];
    weaknesses: string[];
}

function InterviewSessionContent() {
    const params = useParams();
    const interviewId = params?.id as string;

    const [stage, setStage] = useState(1);
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: "ai",
            text: "Hello! Welcome to your technical interview session. I'm your AI technical evaluator. To kick things off: Could you briefly introduce yourself and the core technologies you enjoy building with the most?",
            timestamp: "Just now",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setInput("");

        // Add candidate message
        const newHistory = [
            ...messages,
            { sender: "candidate" as const, text: userText, timestamp: "Just now" },
        ];
        setMessages(newHistory);
        setLoading(true);

        try {
            const res = await fetch("/api/ai/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    interviewId,
                    answer: userText,
                    stage,
                }),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Failed to process interview message");

            setStage(json.nextStage);

            // Add AI follow-up response
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: json.nextQuestion, timestamp: "Just now" },
            ]);

            if (json.isFinished && json.evaluation) {
                setEvaluation(json.evaluation);
            }
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const STAGE_LABELS = [
        "1. Introduction",
        "2. Project Architecture",
        "3. Concurrency & Scale",
        "4. System Trade-offs",
    ];

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
            {/* Top Header */}
            <header className="h-16 border-b border-slate-800 bg-[#07090e]/90 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href="/candidate/dashboard"
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                    <div className="h-4 w-px bg-slate-800" />
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h1 className="font-bold text-white text-sm">AI Dynamic Technical Interview</h1>
                    </div>
                </div>

                {/* Stage Stepper */}
                <div className="hidden md:flex items-center gap-2">
                    {STAGE_LABELS.map((label, idx) => (
                        <div
                            key={label}
                            className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${stage === idx + 1
                                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-semibold"
                                    : stage > idx + 1
                                        ? "bg-slate-900 border-slate-800 text-slate-500 line-through"
                                        : "bg-transparent border-transparent text-slate-600"
                                }`}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </header>

            {/* Main Chat Workspace */}
            <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-2 py-4">
                    {messages.map((m, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-3.5 ${m.sender === "candidate" ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            {m.sender === "ai" ? (
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shrink-0 shadow-md shadow-cyan-500/20">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            ) : (
                                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 font-bold text-xs">
                                    ME
                                </div>
                            )}

                            <div
                                className={`p-4 rounded-2xl max-w-xl text-sm leading-relaxed ${m.sender === "candidate"
                                        ? "bg-cyan-950/40 border border-cyan-800/40 text-cyan-100 rounded-tr-none"
                                        : "bg-slate-900/60 border border-slate-800 text-slate-200 rounded-tl-none"
                                    }`}
                            >
                                <p>{m.text}</p>
                                <span className="block text-[10px] text-slate-500 mt-2 text-right">
                                    {m.timestamp}
                                </span>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                                <span>AI Interviewer is formulating follow-up...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                {!evaluation && (
                    <form
                        onSubmit={handleSendMessage}
                        className="pt-4 border-t border-slate-800 flex gap-2 items-center"
                    >
                        <input
                            type="text"
                            required
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your technical response here (e.g. explain your architecture or design decisions)..."
                            disabled={loading}
                            className="flex-1 bg-slate-900/80 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-40"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                )}
            </div>

            {/* Completion Scorecard Modal (PRD Section 22) */}
            {evaluation && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl animate-in fade-in">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Interview Complete!</h3>
                                    <p className="text-xs text-slate-400">AI Evaluation & Scorecard Generated</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-xs font-mono text-slate-400 uppercase block">Overall Score</span>
                                <span className="text-3xl font-black text-emerald-400">{evaluation.overallScore}%</span>
                            </div>
                        </div>

                        {/* Rubric Matrix */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Technical Depth</span>
                                <span className="text-base font-bold text-cyan-400">{evaluation.technicalDepth}%</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Problem Solving</span>
                                <span className="text-base font-bold text-blue-400">{evaluation.problemSolving}%</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Communication</span>
                                <span className="text-base font-bold text-purple-400">{evaluation.communication}%</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Architecture</span>
                                <span className="text-base font-bold text-amber-400">{evaluation.architecture}%</span>
                            </div>
                        </div>

                        {/* Strengths & Observations */}
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-2">
                                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Strengths Detected
                                </h4>
                                <ul className="text-xs text-slate-300 space-y-1">
                                    {evaluation.strengths.map((s, idx) => (
                                        <li key={idx} className="flex items-start gap-1.5">
                                            <span className="text-emerald-400">•</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {evaluation.weaknesses.length > 0 && (
                                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-2">
                                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                        <TrendingUp className="w-3.5 h-3.5" /> Area to Explore
                                    </h4>
                                    <p className="text-xs text-slate-300">{evaluation.weaknesses[0]}</p>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/candidate/dashboard"
                            className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
                        >
                            Return to Candidate Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function InterviewSessionPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-slate-400 text-sm">
                    Loading AI interview session...
                </div>
            }
        >
            <InterviewSessionContent />
        </Suspense>
    );
}
