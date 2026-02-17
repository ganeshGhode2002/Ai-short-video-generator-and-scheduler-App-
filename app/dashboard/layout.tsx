import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar - Desktop */}
            <div className="hidden md:block">
                <DashboardSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto bg-accent/10 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
