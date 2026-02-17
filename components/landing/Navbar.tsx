import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="rounded-lg bg-blue-600 p-1.5 text-white">
                        <VideoIcon className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg sm:inline-block">VidMax</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link
                        href="#features"
                        className="transition-colors hover:text-foreground"
                    >
                        Features
                    </Link>
                    <Link
                        href="#pricing"
                        className="transition-colors hover:text-foreground"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        About
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <SignedOut>
                        <Link href="/sign-in" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground">
                            Sign In
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6" asChild>
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6" asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
