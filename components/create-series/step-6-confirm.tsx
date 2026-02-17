"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2,
    Layers,
    Type,
    Palette,
    Clock,
    Calendar,
    ArrowRight
} from "lucide-react"

interface Step6Props {
    data: {
        contentType: string
        topic: string
        style: string
        duration: string
        scheduleTime: string
        platforms: string[]
    }
}

export function Step6Confirm({ data }: Step6Props) {
    const summaryItems = [
        { label: "Content Type", value: data.contentType, icon: Layers },
        { label: "Topic", value: data.topic, icon: Type },
        { label: "Style", value: data.style, icon: Palette },
        { label: "Duration", value: data.duration, icon: Clock },
        { label: "Schedule", value: data.scheduleTime, icon: Calendar },
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Review & Generate</h2>
                <p className="text-muted-foreground">Everything looks great! Ready to start your series?</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {summaryItems.map((item) => (
                                <div key={item.label} className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <item.icon className="w-3.5 h-3.5" />
                                        {item.label}
                                    </div>
                                    <div className="text-lg font-medium capitalize truncate">
                                        {item.value || "Not selected"}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-primary/10">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                Target Platforms
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.platforms.map((p) => (
                                    <Badge key={p} variant="secondary" className="px-3 py-1 capitalize bg-primary/10 text-primary border-none">
                                        {p}
                                    </Badge>
                                ))}
                                {data.platforms.length === 0 && (
                                    <span className="text-sm text-yellow-500 italic">No platforms selected</span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="bg-primary/10 rounded-2xl p-5 flex items-start gap-4">
                    <div className="p-2 bg-primary rounded-full mt-1">
                        <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Weekly Auto-Mode Active</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We'll automatically generate and schedule <strong>7 daily videos</strong> for this series. You can review them in your dashboard anytime.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
