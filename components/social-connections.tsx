"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Youtube, Instagram, Music2, Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { connectSocialAccount, disconnectSocialAccount } from "@/app/actions/video-actions"
import { toast } from "sonner"

const platforms = [
    {
        id: "youtube",
        name: "YouTube",
        icon: Youtube,
        color: "text-red-500",
        description: "Publish to YouTube Shorts automatically."
    },
    {
        id: "instagram",
        name: "Instagram",
        icon: Instagram,
        color: "text-pink-500",
        description: "Post Reels to your connected Meta account."
    },
    {
        id: "tiktok",
        name: "TikTok",
        icon: Music2,
        color: "text-cyan-500",
        description: "Direct upload to TikTok for maximum reach."
    },
    {
        id: "email",
        name: "Email / Newsletter",
        icon: Mail,
        color: "text-blue-500",
        description: "Send video updates to your email list."
    },
]

interface SocialAccountsProps {
    connectedAccounts: any[]
}

export function SocialConnections({ connectedAccounts }: SocialAccountsProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const toggleConnection = async (platformId: string) => {
        setLoadingId(platformId)
        try {
            const existing = connectedAccounts.find(a => a.platform === platformId)

            if (existing) {
                await disconnectSocialAccount(existing.id)
                toast.success(`Disconnected from ${platformId}`)
            } else {
                // Simulating OAuth flow
                await connectSocialAccount(platformId)
                toast.success(`Connected to ${platformId}!`)
            }
        } catch (err) {
            toast.error("Action failed. Please try again.")
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {platforms.map((platform) => {
                    const isConnected = connectedAccounts.some(a => a.platform === platform.id)
                    const isLoading = loadingId === platform.id

                    return (
                        <Card key={platform.id} className="p-5 bg-card/50 backdrop-blur-sm border-2 border-transparent hover:border-primary/10 transition-all">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl bg-accent/50 ${platform.color}`}>
                                        <platform.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold">{platform.name}</h4>
                                            {isConnected ? (
                                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none flex items-center gap-1 h-5 px-2">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Connected
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground border-muted-foreground/20 flex items-center gap-1 h-5 px-2">
                                                    <XCircle className="w-3 h-3" />
                                                    Disconnected
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{platform.description}</p>
                                    </div>
                                </div>
                                <Button
                                    variant={isConnected ? "outline" : "default"}
                                    onClick={() => toggleConnection(platform.id)}
                                    disabled={isLoading}
                                    className={isConnected ? "text-destructive hover:bg-destructive/10 hover:text-destructive w-32" : "bg-primary shadow-lg shadow-primary/20 w-32"}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : (isConnected ? "Disconnect" : "Connect")}
                                </Button>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
