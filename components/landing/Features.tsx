import { Zap, Calendar, Share2, Mail, Video, BarChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const features = [
    {
        name: "AI Video Generation",
        description: "Create engaging short-form videos from text prompts in seconds using advanced AI models.",
        icon: Video,
    },
    {
        name: "Auto-Scheduling",
        description: "Schedule your content across YouTube, Instagram, and Facebook automatically.",
        icon: Calendar,
    },
    {
        name: "Multi-Platform Support",
        description: "Optimize and publish to all major short-video platforms from a single dashboard.",
        icon: Share2,
    },
    {
        name: "Email Notifications",
        description: "Get notified when your videos are ready, published, or improving in performance.",
        icon: Mail,
    },
    {
        name: "Performance Analytics",
        description: "Track views, engagement, and growth across all your channels.",
        icon: BarChart,
    },
    {
        name: "Instant Viral Templates",
        description: "Use proven templates to increase your chances of going viral.",
        icon: Zap,
    },
];

export function Features() {
    return (
        <section id="features" className="container space-y-12 py-8 md:py-12 lg:py-24 relative">
            {/* Background blob for visual interest */}
            <div className="absolute top-1/2 left-0 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl opacity-20" />

            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                    Features designed for <span className="text-primary">Growth</span>
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Everything you need to dominate short-form video content.
                </p>
            </div>

            <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                {features.map((feature) => (
                    <Card key={feature.name} className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-md">
                        <CardHeader className="pb-2">
                            <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <CardTitle>{feature.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
