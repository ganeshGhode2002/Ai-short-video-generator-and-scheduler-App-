import { Card } from "@/components/ui/card"
import {
    PlayCircle,
    Lightbulb,
    Rocket,
    Target,
    Youtube,
    Instagram,
    Music2,
    BookOpen,
    ArrowRight
} from "lucide-react"

const guides = [
    {
        title: "Getting Started",
        description: "Learn how to create your first series and generate viral content in minutes.",
        icon: Rocket,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Viral Script Secrets",
        description: "How to use the AI to write high-retention hooks and emotional triggers.",
        icon: Lightbulb,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        title: "Platform Optimization",
        description: "Specific tips for YouTube Shorts, Instagram Reels, and TikTok algorithms.",
        icon: Target,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
]

const videoTutorials = [
    { title: "Building a Series from scratch", platform: "Youtube", duration: "5:20" },
    { title: "Managing your Auto-Scheduler", platform: "Instagram", duration: "3:45" },
    { title: "Analyzing Viral Scores", platform: "General", duration: "4:12" },
]

export default function GuidesPage() {
    return (
        <div className="space-y-10 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                    <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">VidMax Academy</h1>
                    <p className="text-muted-foreground text-lg">Master the art of short-form automation.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {guides.map((guide) => (
                    <Card key={guide.title} className="p-6 bg-card/50 backdrop-blur-sm border-2 border-transparent hover:border-primary/10 transition-all cursor-pointer group">
                        <div className={`w-12 h-12 rounded-xl ${guide.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <guide.icon className={`w-6 h-6 ${guide.color}`} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {guide.description}
                        </p>
                        <div className="flex items-center text-primary text-sm font-semibold">
                            Read Guide
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <section className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight">Video Tutorials</h3>
                    <div className="space-y-3">
                        {videoTutorials.map((tutorial) => (
                            <Card key={tutorial.title} className="p-4 bg-card/50 border hover:border-primary/20 transition-colors cursor-pointer flex items-center justify-between group">
                                <div className="flex items-center gap-4 text-sm">
                                    <PlayCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <div>
                                        <p className="font-medium">{tutorial.title}</p>
                                        <p className="text-xs text-muted-foreground">{tutorial.platform} • {tutorial.duration}</p>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    WATCH NOW
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/20 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <Music2 className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-xl font-bold">TikTok Trends Report</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Updated weekly. Stay ahead of the curve with our AI-powered trend analysis for all major platforms.
                    </p>
                    <div className="flex gap-2">
                        <Youtube className="w-5 h-5 text-red-500" />
                        <Instagram className="w-5 h-5 text-pink-500" />
                        <Music2 className="w-5 h-5 text-cyan-500" />
                    </div>
                </section>
            </div>
        </div>
    )
}
