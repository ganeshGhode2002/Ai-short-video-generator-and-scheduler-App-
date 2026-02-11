import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const plans = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for trying out VidMax.",
        features: ["5 AI Videos/month", "Basic Templates", "720p Export", "Watermarked"],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Pro",
        price: "$29",
        description: "For serious content creators.",
        features: [
            "50 AI Videos/month",
            "Premium Templates",
            "1080p Export",
            "No Watermark",
            "Auto-Scheduling",
            "Priority Support",
        ],
        cta: "Subscribe Pro",
        popular: true,
    },
    {
        name: "Agency",
        price: "$99",
        description: "For agencies and power users.",
        features: [
            "Unlimited AI Videos",
            "Custom Branding",
            "4K Export",
            "API Access",
            "Dedicated Account Manager",
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="container py-8 md:py-12 lg:py-24 relative overflow-hidden">
            {/* Background blob */}
            <div className="absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl opacity-20" />

            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                    Simple, transparent pricing
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Choose the plan that's right for you.
                </p>
            </div>
            <div className="grid w-full grid-cols-1 gap-8 pt-8 md:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`flex flex-col relative ${plan.popular
                                ? "border-primary shadow-lg scale-105 z-10 bg-background/60 backdrop-blur-md"
                                : "bg-background/40 backdrop-blur-sm border-border/50"
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                <Badge variant="default" className="px-4 py-1">Most Popular</Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="text-4xl font-bold">
                                {plan.price}
                                <span className="text-sm font-normal text-muted-foreground">
                                    /month
                                </span>
                            </div>
                            <ul className="grid gap-2 text-sm">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="mt-auto">
                            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                                {plan.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
