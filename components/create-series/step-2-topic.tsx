"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

interface Step2Props {
    topic: string
    onTopicChange: (topic: string) => void
}

export function Step2Topic({ topic, onTopicChange }: Step2Props) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">What's the topic?</h2>
                <p className="text-muted-foreground">Describe your video or series in a few words.</p>
            </div>

            <div className="max-w-xl mx-auto space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="topic">Topic or Keywords</Label>
                    <div className="relative">
                        <Input
                            id="topic"
                            placeholder="e.g. Smart work vs hard work, Top 5 AI tools..."
                            value={topic}
                            onChange={(e) => onTopicChange(e.target.value)}
                            className="h-14 px-4 text-lg bg-card/50 border-2 focus-visible:ring-primary/20"
                        />
                        <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />
                    </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        AI Suggestions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "Mindset shifts for 2024",
                            "Coding productivity hacks",
                            "Small business growth",
                            "Healthy morning routine"
                        ].map((suggest) => (
                            <button
                                key={suggest}
                                onClick={() => onTopicChange(suggest)}
                                className="text-xs px-3 py-1.5 rounded-full bg-background border hover:bg-accent transition-colors"
                            >
                                {suggest}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
