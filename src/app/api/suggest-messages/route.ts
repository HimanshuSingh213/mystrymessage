import { google } from "@ai-sdk/google";
import { createTextStreamResponse, streamText, toTextStream } from "ai";
import { NextResponse } from "next/server";

// max duration = 60sec
export const maxDuration = 60

export async function POST(req: Request) {
    try {

        const { messages } = await req.json()

        const result = streamText({
            model: google("gemini-2.5-flash"),
            messages,
            maxOutputTokens: 800,
            temperature: 0.8,
            system: `Create a list of three open-ended and engaging questions formatted as a single string.Each question should be separated by '||'.These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience.Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`,
            onError: ({ error }) => {
                console.error("AI Streaming Error Details:", error);
            },
            onFinish: ({ usage }) => {
                console.log("Stream completed. Tokens used:", usage.totalTokens);
            }
        })

        return createTextStreamResponse({
            stream: toTextStream({ stream: result.stream })
        });

    } catch (err: any) {
        console.error("Request Parsing Error:", err);
        return NextResponse.json({
            success: false,
            message: err.message || "Failed to generate response"
        }, { status: 500 })
    }

}