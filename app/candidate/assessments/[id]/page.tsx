"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    Code2,
    Terminal,
    Play,
    CheckCircle2,
    AlertCircle,
    Clock,
    Sparkles,
    ChevronLeft,
    RotateCcw,
    Check,
    X,
    Loader2,
    ShieldCheck,
    Send,
} from "lucide-react";

interface TestCase {
    id: number;
    input: string;
    expected: string;
    actual?: string;
    passed?: boolean;
    runtimeMs?: number;
}

const STARTER_CODE: Record<string, string> = {
    typescript: `// Two Sum: Return indices of two numbers that add up to target
// Expected Complexity: O(N) Time, O(N) Space

function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}`,
    javascript: `// Two Sum: Return indices of two numbers that add up to target
// Expected Complexity: O(N) Time, O(N) Space

function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}`,
    python: `# Two Sum: Return indices of two numbers that add up to target
# Expected Complexity: O(N) Time, O(N) Space

def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
};

function AssessmentContent() {
    const params = useParams();
    const router = useRouter();
    const assessmentId = params.id as string;

    const [language, setLanguage] = useState<"typescript" | "javascript" | "python">("typescript");
    const [code, setCode] = useState(STARTER_CODE.typescript);
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState<"testcases" | "console">("testcases");

    // Timer: 30 minutes countdown
    const [timeLeft, setTimeLeft] = useState(1800);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const [testCases, setTestCases] = useState<TestCase[]>([
        {
            id: 1,
            input: "nums = [2, 7, 11, 15], target = 9",
            expected: "[0, 1]",
        },
        {
            id: 2,
            input: "nums = [3, 2, 4], target = 6",
            expected: "[1, 2]",
        },
        {
            id: 3,
            input: "nums = [3, 3], target = 6",
            expected: "[0, 1]",
        },
    ]);

    const handleLanguageChange = (lang: "typescript" | "javascript" | "python") => {
        setLanguage(lang);
        setCode(STARTER_CODE[lang]);
    };

    const handleRunTests = async () => {
        setRunning(true);
        setActiveTab("testcases");

        // Simulate deterministic test runner execution
        await new Promise((res) => setTimeout(res, 600));

        setTestCases([
            {
                id: 1,
                input: "nums = [2, 7, 11, 15], target = 9",
                expected: "[0, 1]",
                actual: "[0, 1]",
                passed: true,
                runtimeMs: 1.4,
            },
            {
                id: 2,
                input: "nums = [3, 2, 4], target = 6",
                expected: "[1, 2]",
                actual: "[1, 2]",
                passed: true,
                runtimeMs: 1.1,
            },
            {
                id: 3,
                input: "nums = [3, 3], target = 6",
                expected: "[0, 1]",
                actual: "[0, 1]",
                passed: true,
                runtimeMs: 0.9,
            },
        ]);

        setRunning(false);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise((res) => setTimeout(res, 900));
        setSubmitted(true);
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
            {/* Top Navigation Bar */}
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
                        <h1 className="font-bold text-white text-sm">Two Sum Target Pair</h1>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                            Medium
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Timer */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-white font-semibold">{formatTime(timeLeft)}</span>
                    </div>

                    {/* Language Selector */}
                    <select
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value as "typescript" | "javascript" | "python")}
                        className="bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-mono py-1.5 px-3 rounded-xl focus:outline-none focus:border-cyan-500"
                    >
                        <option value="typescript">TypeScript</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                    </select>

                    {/* Action Buttons */}
                    <button
                        onClick={handleRunTests}
                        disabled={running}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                        {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />}
                        <span>Run Tests</span>
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting || submitted}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
                    >
                        {submitting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Send className="w-3.5 h-3.5" />
                        )}
                        <span>{submitted ? "Submitted" : "Submit Solution"}</span>
                    </button>
                </div>
            </header>

            {/* Main Split-Pane Workspace */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                {/* Left Pane: Problem Description (5 cols) */}
                <div className="lg:col-span-5 border-r border-slate-800 p-6 overflow-y-auto space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-extrabold text-white">Problem Description</h2>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Given an array of integers <code className="text-cyan-400 font-mono">nums</code> and an integer{" "}
                            <code className="text-cyan-400 font-mono">target</code>, return indices of the two numbers such that they add up to target.
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            You may assume that each input would have exactly one solution, and you may not use the same element twice.
                        </p>
                    </div>

                    {/* Examples */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Examples</h3>

                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 font-mono">
                            <p className="text-slate-400">Input: <span className="text-white">nums = [2, 7, 11, 15], target = 9</span></p>
                            <p className="text-slate-400">Output: <span className="text-cyan-400">[0, 1]</span></p>
                            <p className="text-slate-500 text-[11px]">Explanation: nums[0] + nums[1] == 9, return [0, 1].</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 font-mono">
                            <p className="text-slate-400">Input: <span className="text-white">nums = [3, 2, 4], target = 6</span></p>
                            <p className="text-slate-400">Output: <span className="text-cyan-400">[1, 2]</span></p>
                        </div>
                    </div>

                    {/* Constraints */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Constraints & Complexity</h3>
                        <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside font-mono">
                            <li>2 &lt;= nums.length &lt;= 10^4</li>
                            <li>-10^9 &lt;= nums[i] &lt;= 10^9</li>
                            <li>Expected Time Complexity: <span className="text-emerald-400 font-bold">O(N)</span></li>
                            <li>Expected Space Complexity: <span className="text-cyan-400 font-bold">O(N)</span></li>
                        </ul>
                    </div>
                </div>

                {/* Right Pane: Code Editor + Test Runner (7 cols) */}
                <div className="lg:col-span-7 flex flex-col bg-[#05070a]">
                    {/* Code Editor Area */}
                    <div className="flex-1 flex flex-col border-b border-slate-800">
                        <div className="h-9 px-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                            <span>Solution.{language === "python" ? "py" : language === "javascript" ? "js" : "ts"}</span>
                            <button
                                onClick={() => setCode(STARTER_CODE[language])}
                                className="hover:text-white flex items-center gap-1 transition-colors"
                                title="Reset to starter code"
                            >
                                <RotateCcw className="w-3 h-3" /> Reset
                            </button>
                        </div>

                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                            className="flex-1 w-full bg-transparent p-5 font-mono text-sm text-cyan-200 resize-none focus:outline-none selection:bg-cyan-500/30 leading-relaxed"
                        />
                    </div>

                    {/* Bottom Pane: Test Cases & Execution Results */}
                    <div className="h-64 flex flex-col bg-slate-950/90">
                        <div className="h-10 px-4 border-b border-slate-800 flex items-center gap-6 text-xs font-medium">
                            <button
                                onClick={() => setActiveTab("testcases")}
                                className={`h-full flex items-center gap-2 border-b-2 transition-all ${activeTab === "testcases"
                                        ? "border-cyan-400 text-cyan-400 font-semibold"
                                        : "border-transparent text-slate-400 hover:text-white"
                                    }`}
                            >
                                <Terminal className="w-3.5 h-3.5" />
                                <span>Test Cases ({testCases.filter((t) => t.passed).length}/{testCases.length} Passed)</span>
                            </button>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
                            {testCases.map((tc) => (
                                <div
                                    key={tc.id}
                                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 font-bold">Case {tc.id}:</span>
                                            <span className="text-white">{tc.input}</span>
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                            Expected: <span className="text-cyan-300">{tc.expected}</span>
                                            {tc.actual && (
                                                <span> • Output: <span className="text-emerald-300">{tc.actual}</span></span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-3">
                                        {tc.runtimeMs && (
                                            <span className="text-[10px] text-slate-500">{tc.runtimeMs}ms</span>
                                        )}
                                        {tc.passed !== undefined && (
                                            <span
                                                className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold ${tc.passed
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                    }`}
                                            >
                                                {tc.passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                {tc.passed ? "Passed" : "Failed"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Success Modal */}
            {submitted && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-white">Assessment Submitted!</h3>
                            <p className="text-xs text-slate-400">
                                Your deterministic score and qualitative code review have been recorded.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 text-left">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Test Cases Passed:</span>
                                <span className="text-emerald-400 font-bold">3 / 3 (100%)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Time Complexity:</span>
                                <span className="text-cyan-400 font-bold">O(N) Optimal</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">AI Quality Rating:</span>
                                <span className="text-purple-400 font-bold">92/100</span>
                            </div>
                        </div>

                        <Link
                            href="/candidate/dashboard"
                            className="block w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
                        >
                            Return to Candidate Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CodingAssessmentPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-slate-400 text-sm">
                    Loading coding sandbox...
                </div>
            }
        >
            <AssessmentContent />
        </Suspense>
    );
}
