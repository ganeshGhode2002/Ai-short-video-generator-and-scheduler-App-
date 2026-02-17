import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 md:pt-32 md:pb-32">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-900/40 blur-[100px] opacity-50 dark:opacity-40" />

            <div className="container flex max-w-[64rem] flex-col items-center gap-8 text-center px-4">

                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium backdrop-blur">
                    <Sparkles className="mr-2 h-3.5 w-3.5 text-blue-400" />
                    <span className="text-muted-foreground">AI-Powered Video Generation</span>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                    Generate & Schedule <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        AI Component Videos
                    </span>
                </h1>

                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-balance">
                    Create engaging shorts for YouTube, Instagram, and TikTok in seconds.
                    <br className="hidden sm:inline" />
                    Automate your content calendar with our intelligent scheduler.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 mt-6 w-full justify-center">
                    <SignedOut>
                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 w-full justify-center">
                            <SignInButton mode="modal">
                                <Button size="lg" className="h-12 px-8 rounded-md bg-white text-black hover:bg-white/90 text-base font-medium cursor-pointer">
                                    Start Creating for Free <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </SignInButton>
                            <Button size="lg" variant="outline" className="h-12 px-8 rounded-md border-white/20 bg-transparent text-base hover:bg-white/10" asChild>
                                <Link href="#features">
                                    How it works
                                </Link>
                            </Button>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 w-full justify-center">
                            <Button size="lg" className="h-12 px-8 rounded-md bg-white text-black hover:bg-white/90 text-base font-medium" asChild>
                                <Link href="/dashboard">
                                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 rounded-md border-white/20 bg-transparent text-base hover:bg-white/10" asChild>
                                <Link href="#features">
                                    How it works
                                </Link>
                            </Button>
                        </div>
                    </SignedIn>
                </div>

                <div className="mt-16 sm:mt-24 space-y-6">
                    <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">Trusted by creators on</p>
                    <div className="flex flex-wrap justify-center gap-8 sm:gap-16 opacity-70 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                        <span className="text-lg font-bold flex items-center gap-2"><div className="w-1 h-4 bg-red-600 inline-block"></div>YouTube Shorts</span>
                        <span className="text-lg font-bold flex items-center gap-2"><div className="w-1 h-4 bg-pink-600 inline-block"></div>Instagram Reels</span>
                        <span className="text-lg font-bold flex items-center gap-2"><div className="w-1 h-4 bg-black dark:bg-white inline-block"></div>TikTok</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
