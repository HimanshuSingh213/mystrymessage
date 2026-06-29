"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    MessageSquare, 
    ArrowRight, 
    Lock, 
    Sliders, 
    ChevronLeft, 
    ChevronRight, 
    Sparkles,
    ShieldCheck
} from 'lucide-react';

const sampleMessages = [
    {
        title: "Message from Anonymous",
        content: "Hey, I really love your latest project! The UI looks absolutely premium and sleek.",
        time: "2 hours ago"
    },
    {
        title: "Question from Classmate",
        content: "What is your secret to staying so focused and productive while coding?",
        time: "5 hours ago"
    },
    {
        title: "Feedback from Colleague",
        content: "You did an amazing job leading the team meeting today. Keep inspiring us!",
        time: "1 day ago"
    },
    {
        title: "Message from Secret Admirer",
        content: "If you could travel anywhere in the world right now, where would you go?",
        time: "2 days ago"
    }
];

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play interval for the carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % sampleMessages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? sampleMessages.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % sampleMessages.length);
    };

    return (
        <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black text-zinc-950 dark:text-white transition-colors duration-300 min-h-[calc(100vh-4rem)]">
            
            {/* Background Decorative Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_40%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.05),transparent_40%)] pointer-events-none" />

            {/* Hero Section */}
            <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8 space-y-8">
                
                {/* Floating Badge */}
                <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-950/30 dark:text-indigo-400 backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Receive Unfiltered Truths</span>
                </div>

                {/* Main Heading */}
                <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-none">
                    Dive into the World of{" "}
                    <span className="block mt-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Anonymous Feedback
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mx-auto max-w-2xl text-base text-zinc-500 dark:text-zinc-400 sm:text-lg md:text-xl leading-relaxed">
                    Mystry Message lets you share your personal feedback link with friends, colleagues, or your audience to collect honest, anonymous messages and questions.
                </p>

                {/* Action CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link href="/sign-up">
                        <Button className="w-full sm:w-auto h-12 px-8 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all font-semibold gap-2">
                            <span>Get Started</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/sign-in">
                        <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-full border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 font-semibold">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Custom Auto-playing Premium Carousel */}
            <section className="mx-auto max-w-3xl w-full px-4 pb-20">
                <div className="relative rounded-3xl border border-zinc-200/60 bg-white/60 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/40 overflow-hidden">
                    
                    {/* Carousel Background Accents */}
                    <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        
                        {/* Slide Display Container */}
                        <div className="h-32 flex items-center justify-center w-full transition-all duration-500">
                            <div className="space-y-3 animate-fade-in">
                                <h4 className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                                    {sampleMessages[currentIndex].title}
                                </h4>
                                <p className="text-lg md:text-xl font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed max-w-xl">
                                    "{sampleMessages[currentIndex].content}"
                                </p>
                                <span className="block text-xs text-zinc-400 dark:text-zinc-500">
                                    {sampleMessages[currentIndex].time}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Dots and Controls */}
                        <div className="flex items-center gap-6 pt-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500"
                                onClick={prevSlide}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            {/* Dot Indicators */}
                            <div className="flex items-center gap-1.5">
                                {sampleMessages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            currentIndex === index 
                                                ? "w-5 bg-indigo-500" 
                                                : "w-1.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
                                        }`}
                                    />
                                ))}
                            </div>

                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500"
                                onClick={nextSlide}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-12">
                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                        Uncompromised Features
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Designed from the ground up for seamless communication.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    
                    {/* Card 1: 100% Anonymous */}
                    <Card className="border border-zinc-200/60 bg-white/50 dark:border-zinc-800/60 dark:bg-zinc-900/30 backdrop-blur-md shadow-sm rounded-2xl hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all duration-300 group">
                        <CardHeader className="space-y-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                                <Lock className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-base font-bold text-zinc-900 dark:text-white normal-case tracking-normal">
                                100% Anonymous
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            No tracking, no identity logs. Your audience can send feedback without signing up, ensuring complete confidentiality.
                        </CardContent>
                    </Card>

                    {/* Card 2: Inbox Control */}
                    <Card className="border border-zinc-200/60 bg-white/50 dark:border-zinc-800/60 dark:bg-zinc-900/30 backdrop-blur-md shadow-sm rounded-2xl hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all duration-300 group">
                        <CardHeader className="space-y-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                                <Sliders className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-base font-bold text-zinc-900 dark:text-white normal-case tracking-normal">
                                Full Control
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Pause message submissions anytime with our simple dashboard toggle switch. Delete messages instantly with single-click alerts.
                        </CardContent>
                    </Card>

                    {/* Card 3: Encrypted & Secure */}
                    <Card className="border border-zinc-200/60 bg-white/50 dark:border-zinc-800/60 dark:bg-zinc-900/30 backdrop-blur-md shadow-sm rounded-2xl hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all duration-300 group">
                        <CardHeader className="space-y-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 group-hover:scale-105 transition-transform">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-base font-bold text-zinc-900 dark:text-white normal-case tracking-normal">
                                Safe and Secure
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Robust backend encryption and next-auth JWT session protection ensure your personal inbox remains private and secure.
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
