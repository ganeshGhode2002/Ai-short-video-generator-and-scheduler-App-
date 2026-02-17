"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

const durations = [
    { id: "30-50", title: "30–50 seconds", description: "Fast-paced viral hook" },
    { id: "50-60", title: "50–60 seconds", description: "Balanced storytelling" },
    { id: "custom", title: "Custom", description: "Define your own length" },
]

interface Step4Props {
    selected: string
    onSelect: (id: string) => void
}

export function Step4Duration({ selected, onSelect }: Step4Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Video Duration</h2>
                <p className="text-muted-foreground">How long should your short videos be?</p>
            </div>

            <div className="max-w-2xl mx-auto grid gap-4">
                {durations.map((duration) => (
                    <Card
                        key={duration.id}
                        className={cn(
                            "relative p-5 cursor-pointer border-2 transition-all flex items-center gap-4",
                            selected === duration.id
                                ? "border-primary bg-primary/5"
                                : "border-transparent bg-card/50 backdrop-blur-sm hover:border-border"
                        )}
                        onClick={() => onSelect(duration.id)}
                    >
                        <div className={cn(
                            "p-3 rounded-full",
                            selected === duration.id ? "bg-primary text-primary-foreground" : "bg-accent/50 text-muted-foreground"
                        )}>
                            <Clock className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{duration.title}</h3>
                            <p className="text-sm text-muted-foreground">{duration.description}</p>
                        </div>
                        {selected === duration.id && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
