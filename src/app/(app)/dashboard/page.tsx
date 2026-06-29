"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import MessageCard, { MessageType } from '@/components/MessageCard';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RefreshCw, Copy, ExternalLink, Inbox, Check, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [acceptMessages, setAcceptMessages] = useState(false);
    
    // Copy button states
    const [copied, setCopied] = useState(false);
    const [profileUrl, setProfileUrl] = useState('');

    // Toast states
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Get current message acceptance status
    const getAcceptMessageStatus = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            if (response.data.success) {
                setAcceptMessages(!!response.data.isAcceptingMessages);
            }
        } catch (error) {
            console.error("Error fetching message status:", error);
            triggerToast("Failed to fetch message settings");
        } finally {
            setIsSwitchLoading(false);
        }
    }, []);

    // Get all messages
    const fetchMessages = useCallback(async (refresh = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            if (response.data.success) {
                // The messages array is returned in the 'message' field
                setMessages((response.data.message as unknown as MessageType[]) || []);
                if (refresh) {
                    triggerToast("Inbox refreshed successfully");
                }
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            triggerToast("Failed to load messages");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Sync state when session is loaded
    useEffect(() => {
        if (!session || !session.user) return;
        
        // Build the public URL
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        setProfileUrl(`${baseUrl}/u/${session.user.username}`);

        getAcceptMessageStatus();
        fetchMessages();
    }, [session, getAcceptMessageStatus, fetchMessages]);

    // Handle toggle switch for accepting messages
    const handleSwitchChange = async () => {
        setIsSwitchLoading(true);
        const nextState = !acceptMessages;
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: nextState
            });
            if (response.data.success) {
                setAcceptMessages(nextState);
                triggerToast(response.data.message || "Settings updated");
            }
        } catch (error) {
            console.error("Error updating message acceptance:", error);
            triggerToast("Failed to update status");
        } finally {
            setIsSwitchLoading(false);
        }
    };

    // Handle delete callback from MessageCard
    const handleMessageDelete = (messageId: string) => {
        setMessages((prev) => prev.filter((m) => m._id.toString() !== messageId));
        triggerToast("Message deleted successfully");
    };

    // Handle copy to clipboard
    const copyToClipboard = () => {
        if (!profileUrl) return;
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        triggerToast("Profile link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    // Redirect safeguard if loading or not auth
    if (status === "loading") {
        return (
            <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black min-h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        );
    }

    if (!session || !session.user) {
        return (
            <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black min-h-[calc(100vh-4rem)] p-4 text-center">
                <div className="max-w-md space-y-4">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Not Authenticated</h2>
                    <p className="text-zinc-500">Please sign in to access your dashboard.</p>
                    <Link href="/sign-in">
                        <Button className="bg-indigo-600 text-white hover:bg-indigo-500">Sign In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const user = session.user as User;

    return (
        <div className="flex-1 bg-zinc-50 dark:bg-black min-h-[calc(100vh-4rem)] transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
                
                {/* Greeting & Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                            User Dashboard
                        </h1>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Manage your anonymous messages link and view received messages.
                        </p>
                    </div>
                </div>

                {/* Main Action Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    
                    {/* Share Link Card */}
                    <div className="md:col-span-2 rounded-2xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/50 flex flex-col justify-between">
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                                <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                                Your Public Messages Link
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Share this link with others to receive anonymous messages from them.
                            </p>
                        </div>
                        
                        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                            <input
                                type="text"
                                value={profileUrl}
                                readOnly
                                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300"
                            />
                            <div className="flex gap-2">
                                <Button
                                    onClick={copyToClipboard}
                                    variant="outline"
                                    className="flex-1 sm:flex-initial gap-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 rounded-xl"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-4 w-4 text-emerald-500 animate-scale" />
                                            <span className="text-emerald-500">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            <span>Copy Link</span>
                                        </>
                                    )}
                                </Button>
                                
                                <Link href={`/u/${user.username}`} target="_blank">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
                                        title="View public profile page"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Settings / Accept Message Toggle Card */}
                    <div className="rounded-2xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/50 flex flex-col justify-between">
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
                                Message Settings
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Toggle whether people can currently send messages to your profile link.
                            </p>
                        </div>
                        
                        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 p-4 border border-zinc-100 dark:border-zinc-900">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    Accepting Messages
                                </span>
                                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                    {acceptMessages ? "People can send messages" : "Submissions are paused"}
                                </span>
                            </div>
                            <Switch
                                checked={acceptMessages}
                                onCheckedChange={handleSwitchChange}
                                disabled={isSwitchLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Inbox Header & Action Row */}
                <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">
                            Inbox Messages
                        </h2>
                        <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-3 py-0.5 text-xs font-semibold">
                            {messages.length} Total
                        </span>
                    </div>
                    
                    <Button
                        onClick={() => fetchMessages(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 rounded-xl"
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                        <span>Refresh Inbox</span>
                    </Button>
                </div>

                {/* Messages Display Grid */}
                {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                    </div>
                ) : messages.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {messages.map((message) => (
                            <MessageCard
                                key={message._id.toString()}
                                message={message}
                                onMessageDelete={handleMessageDelete}
                            />
                        ))}
                    </div>
                ) : (
                    /* Premium Empty State */
                    <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center max-w-xl mx-auto space-y-4">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
                            <Inbox className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Your inbox is empty</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                You haven't received any anonymous feedback yet. Copy your public link above and share it with friends to get started!
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Premium Toast Banner */}
            {showToast && (
                <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 shadow-lg shadow-black/10 border border-zinc-800 dark:border-zinc-200 transition-all duration-300 animate-slide-up">
                    <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
                    <span className="text-xs font-semibold">{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
