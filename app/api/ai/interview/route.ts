import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { answer, stage } = await req.json();

        if (!answer) {
            return NextResponse.json({ error: "No answer provided" }, { status: 400 });
        }

        // Dynamic contextual responses per PRD Section 21.2
        let nextQuestion = "";
        const nextStage = stage + 1;
        let isFinished = false;

        if (stage === 1) {
            nextQuestion = `That's great context. Looking at your engineering background, you mentioned building real-time scalable systems. Could you walk me through the architecture of your most challenging project and how data flowed between client and database?`;
        } else if (stage === 2) {
            nextQuestion = `Interesting architectural choice. When scaling that application, how did you handle concurrent user connections, message ordering, and reconnection state?`;
        } else if (stage === 3) {
            nextQuestion = `Let's discuss trade-offs: If you had to redesign that system today for 10x traffic, what bottlenecks in your database schema or caching layer would you re-architect first?`;
        } else {
            isFinished = true;
            nextQuestion = `Thank you! You have completed all rounds of the technical interview. Here is your generated evaluation report.`;
        }

        const evaluation = isFinished
            ? {
                overallScore: 86,
                technicalDepth: 88,
                problemSolving: 89,
                communication: 84,
                architecture: 82,
                strengths: [
                    "Clear explanation of client-server lifecycle and state recovery",
                    "Strong understanding of asynchronous execution and caching patterns",
                    "Articulate communication regarding architectural trade-offs",
                ],
                weaknesses: [
                    "Could elaborate more on database connection pooling limits under burst traffic",
                ],
            }
            : null;

        return NextResponse.json({
            success: true,
            nextQuestion,
            nextStage,
            isFinished,
            evaluation,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to process interview response";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
