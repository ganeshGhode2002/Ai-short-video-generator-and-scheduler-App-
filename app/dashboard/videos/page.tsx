import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { VideoCard } from "@/components/video-card"
import { RepairVideosButton } from "@/components/repair-videos-button"

export default async function VideosPage() {
    const { userId } = await auth()
    if (!userId) return null

    const supabase = createAdminClient() as any
    const { data: videos } = await supabase
        .from("videos")
        .select(`
            *,
            series (
                name
            )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-center bg-card/30 p-6 rounded-3xl border-2 border-transparent hover:border-primary/5 transition-all">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Videos</h1>
                    <p className="text-muted-foreground mt-1">Manage and track your automated video content.</p>
                </div>
                <RepairVideosButton />
            </div>

            {!videos || videos.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed p-20 flex flex-col items-center justify-center text-center bg-accent/5">
                    <div className="p-4 rounded-3xl bg-accent mb-4">
                        <Video className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
                    <p className="max-w-xs text-muted-foreground mb-6">
                        Start by creating a new series and we'll handle the rest!
                    </p>
                    <Button asChild className="rounded-xl">
                        <Link href="/dashboard/create">Create My First Series</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video: any) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    )
}
