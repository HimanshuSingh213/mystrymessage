"use client"
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User as AuthUser } from 'next-auth';
import { Button } from './ui/button';
import Link from 'next/link';
import { MessageSquare, LogOut, LogIn, User, Menu, X } from 'lucide-react';

export default function NavBar() {
    const { data: session } = useSession();
    const user = session?.user as AuthUser;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80 transition-colors duration-300">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo and Brand */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <span className="bg-linear-to-r from-zinc-900 via-indigo-950 to-zinc-900 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-white dark:via-indigo-200 dark:to-white">
                            Mystry Message
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {session ? (
                        <div className="flex items-center gap-4">
                            {/* User Welcome Badge */}
                            <div className="flex items-center gap-2.5 rounded-full border border-zinc-200/60 bg-zinc-50/50 py-1 pl-1.5 pr-4 dark:border-zinc-800/60 dark:bg-zinc-900/50">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                                    Welcome, <span className="font-semibold text-zinc-950 dark:text-white">{user.username || user.email}</span>
                                </span>
                            </div>

                            {/* Logout Button */}
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 gap-1.5 border-zinc-200 hover:border-rose-200 hover:bg-rose-50/30 hover:text-rose-600 dark:border-zinc-800 dark:hover:border-rose-900/30 dark:hover:bg-rose-950/10 dark:hover:text-rose-400"
                                onClick={() => signOut()}
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    ) : (
                        <Link href="/sign-in">
                            <Button 
                                size="sm" 
                                className="h-9 gap-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all"
                            >
                                <LogIn className="h-3.5 w-3.5" />
                                <span>Login</span>
                            </Button>
                        </Link>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-zinc-200/50 bg-white/95 dark:border-zinc-800/50 dark:bg-zinc-950/95 transition-all duration-300">
                    <div className="space-y-4 px-4 py-6">
                        {session ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 px-1">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-zinc-400 dark:text-zinc-500">Welcome back</span>
                                        <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                                            {user.username || user.email}
                                        </span>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-center gap-2 border-zinc-200 hover:bg-rose-50/50 hover:text-rose-600 dark:border-zinc-800 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
                                    onClick={() => signOut()}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </Button>
                            </div>
                        ) : (
                            <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                                    <LogIn className="h-4 w-4" />
                                    <span>Login</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
