"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const styles = [
    { id: "classic", title: "Classic", description: "Clean and professional", preview: "T" },
    { id: "highlight", title: "Highlight", description: "Vibrant yellow highlights", preview: "H" },
    { id: "modern", title: "Modern", description: "Sleek sans-serif typography", preview: "M" },
    { id: "neon", title: "Neon", description: "Glowing cyberpunk style", preview: "N" },
    { id: "typewriter", title: "Typewriter", description: "Mechanical typing effect", preview: "W" },
    { id: "pop", title: "Pop", description: "Dynamic jumping text", preview: "P" },
]

interface Step3Props {
    selected: string
    onSelect: (id: string) => void
}

export function Step3Style({ selected, onSelect }: Step3Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Visual Style</h2>
                <p className="text-muted-foreground">Select how your subtitles and text will look.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {styles.map((style) => (
                    <Card
                        key={style.id}
                        className={cn(
                            "relative overflow-hidden cursor-pointer border-2 transition-all hover:scale-[1.02]",
                            selected === style.id
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : "border-transparent bg-card/50 backdrop-blur-sm hover:border-border"
                        )}
                        onClick={() => onSelect(style.id)}
                    >
                        <div className="p-4 h-full flex flex-col justify-between">
                            <div className="aspect-video rounded-lg bg-accent/50 flex items-center justify-center mb-4 overflow-hidden relative group">
                                <span className={cn(
                                    "text-4xl font-black",
                                    style.id === "neon" && "text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]",
                                    style.id === "highlight" && "bg-yellow-400 text-black px-2",
                                    style.id === "pop" && "animate-bounce"
                                )}>
                                    {style.preview}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-sm">{style.title}</h3>
                                <p className="text-xs text-muted-foreground leading-tight">
                                    {style.description}
                                </p>
                            </div>
                        </div>
                        {selected === style.id && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full border-2 border-background" />
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
