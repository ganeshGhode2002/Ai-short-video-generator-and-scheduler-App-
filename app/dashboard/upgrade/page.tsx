"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Sparkles, Rocket } from "lucide-react"

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "Start your video journey",
        features: ["1 series", "5 videos/month", "YouTube only"],
        buttonText: "Current Plan",
        current: true,
    },
    {
        name: "Basic",
        price: "$29",
        description: "Perfect for content creators",
        features: ["3 series", "30 videos/month", "YouTube + Email", "Priority support"],
        buttonText: "Upgrade to Basic",
        icon: Zap,
        popular: true,
    },
    {
        name: "Advanced",
        price: "$99",
        description: "For professional agencies",
        features: ["Unlimited series", "Unlimited videos", "All platforms", "Viral predictor AI", "Analytics dashboard"],
        buttonText: "Contact Sales",
        icon: Rocket,
    },
]

export default function UpgradePage() {
    return (
        <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight">Simple, Transparent Pricing</h1>
                <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                    Choose the plan that fits your growth. Scale your short-form content with AI automation.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`relative p-8 flex flex-col border-2 transition-all hover:scale-[1.02] ${plan.popular ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-2xl" : "border-border bg-card/50"
                            }`}
                    >
                        {plan.popular && (
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 font-bold shadow-lg">
                                Most Popular
                            </Badge>
                        )}

                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                {plan.icon && <plan.icon className="w-5 h-5 text-primary" />}
                                <h3 className="font-bold text-xl">{plan.name}</h3>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <p className="text-muted-foreground">{plan.description}</p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {plan.features.map((feature) => (
                                <div key={feature} className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            variant={plan.current ? "outline" : plan.popular ? "default" : "secondary"}
                            className={`w-full h-12 rounded-xl text-md font-bold ${plan.popular ? "shadow-lg shadow-primary/20" : ""}`}
                            disabled={plan.current}
                        >
                            {plan.buttonText}
                        </Button>
                    </Card>
                ))}
            </div>

            <Card className="p-10 bg-gradient-to-br from-primary/10 via-background to-background border-2 border-primary/20 rounded-[2rem] relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Custom Enterprise Solutions
                        </h3>
                        <p className="text-muted-foreground max-w-xl">
                            Need more than what our standard plans offer? We provide custom API access, dedicated account managers, and white-label options for larger organizations.
                        </p>
                    </div>
                    <Button size="lg" variant="outline" className="rounded-xl px-8 border-primary text-primary hover:bg-primary/10 transition-colors">
                        Book a Demo
                    </Button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </Card>
        </div>
    )
}
