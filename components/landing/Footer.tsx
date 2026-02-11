import Link from "next/link";
import { VideoIcon, Twitter, Instagram, Facebook, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    return (
        <footer className="border-t bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 max-w-6xl">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center space-x-2">
                            <div className="rounded-lg bg-primary p-1 text-primary-foreground">
                                <VideoIcon className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl">VidMax</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The #1 AI-powered short video generator and scheduler. 10x your organic reach on YouTube Shorts, TikTok, and Instagram Reels.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-foreground">Product</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Features
                            </Link>
                            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Pricing
                            </Link>
                            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Integrations
                            </Link>
                            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Changelog
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-foreground">Company</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                About Us
                            </Link>
                            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Careers
                            </Link>
                            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Blog
                            </Link>
                            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-foreground">Subscribe to our newsletter</h4>
                        <p className="text-sm text-muted-foreground">
                            Get the latest updates, tips, and tricks for viral content.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-background"
                            />
                            <Button size="icon">
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Subscribe</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} VidMax Inc. All rights reserved.
                    </p>

                    <div className="flex gap-4">
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Facebook className="h-5 w-5" />
                            <span className="sr-only">Facebook</span>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                    </div>

                    <div className="flex gap-6 text-xs text-muted-foreground">
                        <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                        <Link href="#" className="hover:text-foreground">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
