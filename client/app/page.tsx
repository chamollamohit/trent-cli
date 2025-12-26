"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Terminal, Cpu, ShieldCheck, Github, Sparkles } from "lucide-react";

export default function Home() {
    // Get Session Details
    const { data: session } = authClient.useSession();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* --- Navbar --- */}
            <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Terminal className="w-6 h-6 text-emerald-500" />
                        <span>Trent CLI</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="https://github.com/chamollamohit/trent-cli"
                            target="_blank"
                        >
                            <Button variant="ghost" size="icon">
                                <Github className="w-5 h-5" />
                            </Button>
                        </Link>

                        {/* Conditional Profile / Login */}
                        {session?.user ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-medium">
                                        {session.user.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {session.user.email}
                                    </span>
                                </div>
                                <Button
                                    onClick={() => authClient.signOut()}
                                    variant="outline"
                                    className="border-red-500/50 hover:bg-red-500/10 text-red-500"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Link href="/sign-in">
                                <Button
                                    variant="outline"
                                    className="hover:bg-gray-700 text-white-500"
                                >
                                    Login to CLI
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center">
                {/* --- Hero Section --- */}
                <section className="w-full max-w-5xl px-4 py-24 text-center space-y-8">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>Agentic Mode Active</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Stop Typing Commands. <br /> Start Building.
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Trent CLI isn&apos;t just a terminal—it&apos;s an
                        autonomous AI agent. Use natural language to trigger
                        tool calls, manage files, and build software using
                        Google Gemini.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 items-center">
                        {/* Coming Soon Badge */}
                        <div className="px-6 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 font-mono text-sm text-yellow-500 flex items-center gap-2 cursor-default">
                            <span>🚧 NPM Package Coming Soon</span>
                        </div>

                        <Link
                            href="https://github.com/chamollamohit/trent-cli"
                            target="_blank"
                        >
                            <Button
                                size="lg"
                                className="w-full cursor-pointer hover:bg-gray-400 sm:w-auto"
                            >
                                View on GitHub
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* --- DEMO VIDEOS SECTION --- */}
                <section className="w-full max-w-6xl px-4 pb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        See the Agent in Action
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Video 1: AI Chat & Tools */}
                        <div className="rounded-xl border border-border/50 bg-card p-2 shadow-2xl">
                            <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden relative group">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/UT4gtHAhtXs?rel=0&modestbranding=1"
                                    title="Trent CLI - Core Features Demo"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg">
                                    AI Chat & Smart Tools
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Chat naturally with Gemini AI, or let it
                                    browse the web and execute python code to
                                    find answers for you.
                                </p>
                            </div>
                        </div>

                        {/* Video 2: Agentic Mode */}
                        <div className="rounded-xl border border-border/50 bg-card p-2 shadow-2xl">
                            <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden relative group">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/mwWo0KziimA?rel=0&modestbranding=1"
                                    title="Trent CLI - Agentic Mode Demo"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg">
                                    Autonomous Agent
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Give it a goal, and watch it reason, plan,
                                    and execute multi-step tasks independently.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Features Grid --- */}
                <section className="w-full max-w-5xl px-4 py-16 grid md:grid-cols-3 gap-8 border-t border-border/40">
                    <div className="space-y-2">
                        <ShieldCheck className="w-10 h-10 text-emerald-500" />
                        <h3 className="font-bold text-xl">Device Flow Auth</h3>
                        <p className="text-muted-foreground">
                            Secure, headless authentication powered by OAuth
                            standards.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Cpu className="w-10 h-10 text-blue-500" />
                        <h3 className="font-bold text-xl">Agentic Core</h3>
                        <p className="text-muted-foreground">
                            Powered by Gemini 2.5 to reason, plan, and execute
                            complex terminal commands autonomously.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Terminal className="w-10 h-10 text-purple-500" />
                        <h3 className="font-bold text-xl">Natural Language</h3>
                        <p className="text-muted-foreground">
                            Forget complex flags. Just tell Trent what you want
                            to build in plain English.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
