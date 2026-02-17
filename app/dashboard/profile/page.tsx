"use client"

import { useUser, UserButton } from "@clerk/nextjs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Shield, CreditCard } from "lucide-react"

export default function ProfilePage() {
    const { user, isLoaded } = useUser()

    if (!isLoaded || !user) return null

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
                <p className="text-muted-foreground text-lg">Manage your account information and preferences.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="p-8 flex flex-col items-center text-center space-y-4 lg:col-span-1 bg-card/50 backdrop-blur-sm border-2 border-transparent">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-2xl">
                            <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-card flex items-center justify-center shadow-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user.fullName}</h2>
                        <p className="text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-none px-4 py-1">
                        Free Member
                    </Badge>
                    <div className="pt-4">
                        <UserButton />
                    </div>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 bg-card/50 backdrop-blur-sm space-y-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Account Details
                        </h3>
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between p-4 rounded-xl border bg-accent/5">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Full Name</span>
                                </div>
                                <span className="text-sm">{user.fullName || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border bg-accent/5">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Email Address</span>
                                </div>
                                <span className="text-sm">{user.primaryEmailAddress?.emailAddress}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-card/50 backdrop-blur-sm space-y-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Quick Actions
                        </h3>
                        <div className="flex gap-4">
                            <button className="flex-1 p-4 rounded-xl border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-semibold">
                                Update Password
                            </button>
                            <button className="flex-1 p-4 rounded-xl border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-semibold">
                                Enable 2FA
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
