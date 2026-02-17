import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { SeriesCard } from "@/components/series-card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function SeriesPage() {
    const { userId } = await auth()
    if (!userId) return null

    const supabase = createAdminClient() as any
    const { data: series } = await supabase
        .from("series")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Series</h1>
                    <p className="text-muted-foreground mt-1">Manage and track your automated video production lines.</p>
                </div>
                <Button asChild className="rounded-xl shadow-lg shadow-primary/20">
                    <Link href="/dashboard/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Series
                    </Link>
                </Button>
            </div>

            {!series || series.length === 0 ? (
                <div className="h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center bg-accent/5 p-8">
                    <h3 className="text-xl font-semibold mb-2">No active series</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        You haven't created any automated series yet. Start one now to automate your content.
                    </p>
                    <Button asChild className="rounded-xl">
                        <Link href="/dashboard/create">Get Started</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {series.map((item: any) => (
                        <SeriesCard key={item.id} series={item} />
                    ))}
                </div>
            )}
        </div>
    )
}
