import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin"
import {
    Video,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Zap,
    Plus
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ManualSchedulerTrigger } from "@/components/manual-scheduler-trigger"

export default async function DashboardPage() {
    const { userId } = await auth();
    const supabase = createAdminClient() as any

    // 1. Check if user exists in Supabase first (much faster than Clerk currentUser())
    const { data: userData, error: userFetchError } = await supabase
        .from("users")
        .select("credits, first_name")
        .eq("id", userId)
        .single();

    let userDisplayName = userData?.first_name || "there";

    // 2. Proactive Sync-on-Demand (Only if record is missing or incomplete)
    if (!userData || !userData.first_name) {
        console.log("[DASHBOARD_SYNC] User missing in Supabase, triggering sync...")
        try {
            const clerkUser = await currentUser();
            if (clerkUser) {
                const syncData = {
                    id: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress,
                    first_name: clerkUser.firstName,
                    last_name: clerkUser.lastName,
                    image_url: clerkUser.imageUrl,
                    updated_at: new Date().toISOString(),
                }
                await supabase.from("users").upsert(syncData, { onConflict: 'id' })
                userDisplayName = clerkUser.firstName || "there";
            }
        } catch (err) {
            console.error("[DASHBOARD_SYNC_ERROR]", err);
        }
    }


    // 2. Fetch Dashboard Data in Parallel for maximum speed
    const [
        statsData,
        totalVideosData,
        failedVideosData,
        scheduledPostsData,
        postedTodayData,
        upcomingPostsResults
    ] = await Promise.all([
        supabase.from("users").select("credits").eq("id", userId).single(),
        supabase.from("videos").select("*", { count: 'exact', head: true }).eq("user_id", userId),
        supabase.from("videos").select("*", { count: 'exact', head: true }).eq("user_id", userId).eq("status", "failed"),
        supabase.from("schedules").select("*", { count: 'exact', head: true }).eq("user_id", userId).eq("status", "pending"),
        supabase.from("schedules").select("*", { count: 'exact', head: true }).eq("user_id", userId).eq("status", "posted"),
        supabase.from("schedules").select("*, video:video_id (title)").eq("user_id", userId).eq("status", "pending").order("scheduled_time", { ascending: true }).limit(3)
    ]);

    const stats = [
        { label: "Total Videos", value: totalVideosData.count?.toString() || "0", icon: Video, color: "text-blue-500" },
        { label: "Scheduled", value: scheduledPostsData.count?.toString() || "0", icon: Calendar, color: "text-purple-500" },
        { label: "Posted", value: postedTodayData.count?.toString() || "0", icon: CheckCircle2, color: "text-emerald-500" },
        { label: "Failed", value: failedVideosData.count?.toString() || "0", icon: AlertCircle, color: "text-rose-500" },
    ]

    const credits = statsData.data?.credits ?? 5;
    const usedCredits = (totalVideosData.count || 0);
    const upcomingPosts = upcomingPostsResults.data;

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userDisplayName}!</h1>
                    <p className="text-muted-foreground">Here's what's happening with your video series.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ManualSchedulerTrigger />
                    <Button asChild className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        <Link href="/dashboard/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Series
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-6 bg-card/50 backdrop-blur-sm border-2 border-transparent hover:border-primary/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-accent/50 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Credit Usage */}
                <Card className="p-6 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            Monthly Credits
                        </h3>
                        <Link href="/dashboard/upgrade" className="text-xs text-primary hover:underline font-medium">Upgrade Plan</Link>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Used this month</span>
                            <span className="font-medium">{usedCredits} / {credits + usedCredits} videos</span>
                        </div>
                        <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-1000"
                                style={{ width: `${Math.min((usedCredits / (credits + usedCredits)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </Card>

                {/* Upcoming Scheduled Posts */}
                <Card className="p-6 bg-card/50 backdrop-blur-sm">
                    <h3 className="font-semibold mb-6 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Upcoming Posts
                    </h3>
                    <div className="space-y-4">
                        {!upcomingPosts || upcomingPosts.length === 0 ? (
                            <div className="h-[100px] flex flex-col items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-2xl bg-accent/5">
                                <p>No posts scheduled for today.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingPosts.map((post: any) => (
                                    <div key={post.id} className="flex items-center justify-between p-3 rounded-xl bg-accent/10 border border-accent/20">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-primary uppercase">{post.platform}</span>
                                            <span className="text-sm font-medium line-clamp-1">{(post.video as any)?.title || "Untitled Video"}</span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-mono">
                                            {new Date(post.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
