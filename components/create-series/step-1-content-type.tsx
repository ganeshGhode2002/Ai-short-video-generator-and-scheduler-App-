"use client"

import { Card } from "@/components/ui/card"
import { Flame, Cpu, Briefcase, Heart, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"

const contentTypes = [
    { id: "motivation", icon: Flame, title: "Motivation", color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: "tech", icon: Cpu, title: "Tech News", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "business", icon: Briefcase, title: "Business", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "fitness", icon: Heart, title: "Fitness", color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: "custom", icon: Settings2, title: "Custom", color: "text-purple-500", bg: "bg-purple-500/10" },
]

interface Step1Props {
    selected: string
    onSelect: (id: string) => void
}

export function Step1ContentType({ selected, onSelect }: Step1Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Select Content Type</h2>
                <p className="text-muted-foreground">Choose a category for your new video series.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentTypes.map((type) => (
                    <Card
                        key={type.id}
                        className={cn(
                            "relative p-6 cursor-pointer border-2 transition-all hover:scale-[1.02] active:scale-[0.98]",
                            selected === type.id
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : "border-transparent bg-card/50 backdrop-blur-sm hover:border-border"
                        )}
                        onClick={() => onSelect(type.id)}
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className={cn("p-4 rounded-2xl", type.bg)}>
                                <type.icon className={cn("w-8 h-8", type.color)} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{type.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    AI will tailor the viral script for {type.title.toLowerCase()}.
                                </p>
                            </div>
                        </div>
                        {selected === type.id && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
