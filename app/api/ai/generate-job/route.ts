import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
        }

        // Default high-fidelity structured output per PRD Section 15
        const isFrontend = prompt.toLowerCase().includes("react") || prompt.toLowerCase().includes("frontend");
        const isJunior = prompt.toLowerCase().includes("junior") || prompt.toLowerCase().includes("entry");

        const generatedJob = {
            title: isFrontend
                ? isJunior ? "Junior Frontend Developer (React + Node.js)" : "Senior Frontend Engineer (React / Next.js)"
                : "Full Stack Cloud Software Engineer",
            experienceLevel: isJunior ? "Junior (0-2 yrs)" : "Mid to Senior (3-5+ yrs)",
            employmentType: "Full-time (Remote)",
            location: "Remote",
            description: `We are looking for an ambitious developer who is passionate about crafting clean, modular applications. In this role, you will collaborate with cross-functional teams to build high-performance web applications, participate in architecture discussions, and maintain quality testing standards.`,
            responsibilities: [
                "Develop and optimize responsive UI components using React and TypeScript.",
                "Integrate RESTful and GraphQL APIs with robust error handling and caching.",
                "Collaborate in code reviews, automated CI/CD workflows, and testing cycles.",
                "Ensure high application performance, accessibility, and clean architectural patterns.",
            ],
            requiredSkills: isFrontend
                ? ["React", "TypeScript", "JavaScript", "HTML/CSS", "Node.js", "Git"]
                : ["Node.js", "TypeScript", "PostgreSQL", "REST APIs", "Docker", "Git"],
            preferredSkills: ["Next.js", "Tailwind CSS", "Jest / Vitest", "Supabase", "Redis"],
            assessmentTopics: [
                "Component State Management & Hooks",
                "Asynchronous Data Fetching & Error Boundaries",
                "Algorithmic Data Manipulation (O(N) efficiency)",
            ],
            interviewTopics: [
                "Trade-offs between client-side and server-side rendering",
                "Real-world state synchronization and caching strategies",
                "Walkthrough of candidate's most complex GitHub architecture",
            ],
        };

        return NextResponse.json({ success: true, job: generatedJob });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to generate job";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
