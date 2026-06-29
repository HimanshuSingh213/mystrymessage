"use client"
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const defaultQuestions = [
    "What's a hobby you've recently started?",
    "If you could have dinner with any historical figure, who would it be?",
    "What's a simple thing that makes you happy?"
];

export default function UserProfile() {
    const params = useParams();
    const username = params.username as string;

    const [messageContent, setMessageContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>(defaultQuestions);
    const [responseMessage, setResponseMessage] = useState<{ success: boolean; text: string } | null>(null);

    // Call API to send message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageContent.trim()) return;

        setIsSending(true);
        setResponseMessage(null);
        try {
            const response = await axios.post<ApiResponse>('/api/send-messages', {
                username,
                content: messageContent
            });
            
            if (response.data.success) {
                setMessageContent('');
                setResponseMessage({ success: true, text: "Your anonymous message has been sent successfully!" });
            } else {
                setResponseMessage({ success: false, text: response.data.message || "Failed to send message." });
            }
        } catch (error: any) {
            console.error("Error sending message:", error);
            const errMsg = error.response?.data?.message || "User might not be accepting messages or does not exist.";
            setResponseMessage({ success: false, text: errMsg });
        } finally {
            setIsSending(false);
        }
    };

    // Call AI API to suggest messages (stream reader)
    const handleSuggestQuestions = async () => {
        setIsSuggesting(true);
        setResponseMessage(null);
        try {
            const response = await fetch('/api/suggest-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'user', content: 'Suggest 3 questions' }] })
            });

            if (!response.ok) throw new Error("Failed to fetch suggestions");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let resultText = "";

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;
                resultText += decoder.decode(value);
            }

            // Split by '||' and remove surrounding quotes/whitespaces
            const questions = resultText
                .split('||')
                .map(q => q.replace(/^["'‘“]|["'’”]Default$/g, '').trim())
                .filter(q => q.length > 0);

            if (questions.length >= 3) {
                setSuggestions(questions.slice(0, 3));
            } else {
                setSuggestions(defaultQuestions);
            }
        } catch (error) {
            console.error("AI suggestions failed, falling back to defaults:", error);
            setSuggestions(defaultQuestions);
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleSuggestionClick = (question: string) => {
        setMessageContent(question);
    };

    return (
        <div className="flex-1 bg-zinc-50 dark:bg-black min-h-[calc(100vh-4rem)] text-zinc-950 dark:text-white transition-colors duration-300">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
                
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-md">
                        <User className="h-7 w-7" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Send Anonymous Message
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Send an honest, constructive, or friendly anonymous message to <span className="font-semibold text-zinc-900 dark:text-zinc-100">@{username}</span>.
                    </p>
                </div>

                {/* Message Input Box Card */}
                <Card className="border border-zinc-200/60 bg-white/70 shadow-lg backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/50 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold text-zinc-950 dark:text-white normal-case tracking-normal">
                            Write Message
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <div className="relative">
                                <textarea
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    placeholder="Type your secret message here..."
                                    rows={4}
                                    maxLength={300}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-indigo-500/50 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200"
                                />
                                <span className="absolute bottom-3 right-3 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                                    {messageContent.length}/300
                                </span>
                            </div>

                            {/* Response Alert Message */}
                            {responseMessage && (
                                <div className={`rounded-xl border p-3 text-center text-xs sm:text-sm font-semibold transition-all ${
                                    responseMessage.success
                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 dark:text-emerald-400 dark:border-emerald-500/20"
                                        : "bg-rose-500/10 text-rose-500 border-rose-500/25 dark:text-rose-400 dark:border-rose-500/20"
                                }`}>
                                    {responseMessage.text}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSending || !messageContent.trim()}
                                    className="w-full sm:w-auto gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10 hover:from-indigo-500 hover:to-purple-500 rounded-xl"
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* AI Question Suggestions Section */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                                Suggest Questions (AI Powered)
                            </h3>
                        </div>
                        <Button
                            onClick={handleSuggestQuestions}
                            variant="outline"
                            size="sm"
                            disabled={isSuggesting}
                            className="w-full sm:w-auto gap-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 rounded-xl"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${isSuggesting ? "animate-spin" : ""}`} />
                            <span>Suggest Questions</span>
                        </Button>
                    </div>

                    {/* Question Suggestions List */}
                    <div className="grid gap-3">
                        {suggestions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(question)}
                                className="w-full text-left rounded-xl border border-zinc-200/60 bg-white/50 p-4 text-xs sm:text-sm font-medium text-zinc-700 hover:border-indigo-500/20 hover:bg-indigo-50/10 dark:border-zinc-800/60 dark:bg-zinc-900/30 dark:text-zinc-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-950/5 transition-all text-pretty"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Call to Action Footer */}
                <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-8 text-center space-y-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                            Get Your Own Anonymous Message Inbox
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Create an account to start receiving anonymous feedback and questions from your friends today.
                        </p>
                    </div>
                    <Link href="/sign-up">
                        <Button className="h-10 px-6 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shadow-sm font-semibold">
                            Create Account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
