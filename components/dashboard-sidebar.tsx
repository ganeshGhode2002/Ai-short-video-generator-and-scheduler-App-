"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    PlusCircle,
    Layers,
    Video,
    BookOpen,
    CreditCard,
    Settings,
    Zap,
    User
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create New Series", href: "/dashboard/create", icon: PlusCircle },
    { name: "Series", href: "/dashboard/series", icon: Layers },
    { name: "Videos", href: "/dashboard/videos", icon: Video },
    { name: "Guides", href: "/dashboard/guides", icon: BookOpen },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

const bottomNavigation = [
    { name: "Upgrade Plan", href: "/dashboard/upgrade", icon: Zap, highlight: true },
    { name: "Profile Settings", href: "/dashboard/profile", icon: User },
]

export function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col bg-card border-r">
            <div className="flex h-16 items-center px-6 border-b">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Video className="w-5 h-5" />
                    </div>
                    <span>VidMax</span>
                </Link>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-4 gap-4">
                <nav className="flex-1 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className={cn("mr-3 h-5 w-5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <nav className="mt-auto space-y-1 pt-4 border-t">
                    {bottomNavigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    item.highlight
                                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                                        : isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className={cn("mr-3 h-5 w-5 shrink-0", item.highlight ? "text-primary font-bold" : isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
