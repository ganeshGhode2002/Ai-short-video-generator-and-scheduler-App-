"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Youtube, Instagram, Music2, Mail } from "lucide-react"

const platforms = [
    { id: "youtube", title: "YouTube Shorts", icon: Youtube, color: "text-red-500" },
    { id: "instagram", title: "Instagram Reels", icon: Instagram, color: "text-pink-500" },
    { id: "tiktok", title: "TikTok", icon: Music2, color: "text-cyan-500" },
    { id: "email", title: "Email Newsletter", icon: Mail, color: "text-blue-500" },
]

interface Step5Props {
    scheduleTime: string
    onTimeChange: (time: string) => void
    selectedPlatforms: string[]
    onPlatformToggle: (id: string) => void
}

export function Step5Schedule({
    scheduleTime,
    onTimeChange,
    selectedPlatforms,
    onPlatformToggle
}: Step5Props) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Schedule & Platforms</h2>
                <p className="text-muted-foreground">When and where should we publish?</p>
            </div>

            <div className="max-w-xl mx-auto space-y-8">
                <div className="space-y-4">
                    <Label className="text-base">Publish Time (Daily)</Label>
                    <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => onTimeChange(e.target.value)}
                        className="h-12 bg-card/50 border-2"
                    />
                    <p className="text-xs text-muted-foreground px-1">
                        Videos will be generated 3–6 hours before this time to ensure quality.
                    </p>
                </div>

                <div className="space-y-4">
                    <Label className="text-base">Target Platforms</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {platforms.map((platform) => (
                            <div
                                key={platform.id}
                                className="flex items-center space-x-3 space-y-0 rounded-xl border p-4 bg-card/50 hover:bg-accent/50 cursor-pointer transition-colors"
                                onClick={() => onPlatformToggle(platform.id)}
                            >
                                <Checkbox
                                    id={platform.id}
                                    checked={selectedPlatforms.includes(platform.id)}
                                    onCheckedChange={() => onPlatformToggle(platform.id)}
                                />
                                <div className="flex items-center gap-3 leading-none cursor-pointer">
                                    <platform.icon className={platform.color} />
                                    <Label htmlFor={platform.id} className="font-medium cursor-pointer">
                                        {platform.title}
                                    </Label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
