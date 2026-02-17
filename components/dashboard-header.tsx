import { UserButton } from "@clerk/nextjs"
import { Bell, Search } from "lucide-react"

export function DashboardHeader() {
    return (
        <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4 bg-accent/50 rounded-full px-4 py-1.5 w-full max-w-md border border-transparent focus-within:border-primary transition-all">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search videos, series..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-accent relative transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
                </button>
                <div className="h-8 w-[1px] bg-border mx-1"></div>
                <UserButton />
            </div>
        </header>
    )
}
