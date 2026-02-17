import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateVideoScript } from "@/lib/ai"
import { renderVideo } from "@/lib/video-engine"

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        const { contentType, topic, style, duration } = await req.json()

        // 1. Parallelize tasks: Fetch user meta and generate AI script simultaneously
        const [userAccount, aiScript] = await Promise.all([
            currentUser().catch(() => null),
            generateVideoScript(topic, contentType, style, duration)
        ]);

        const userEmail = userAccount?.emailAddresses?.[0]?.emailAddress || "user@vidmax.ai"
        const userName = userAccount?.firstName || "Creator"

        const supabase = createAdminClient() as any

        // 1.5 Ensure User exists in Supabase (Sync on demand)
        // Optimized: only upsert necessary fields
        const { error: userSyncError } = await supabase
            .from("users")
            .upsert({
                id: userId,
                email: userEmail,
                first_name: userName,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' })

        if (userSyncError) {
            console.error("[CRITICAL_USER_SYNC_ERROR] Cannot proceed with generation:", userSyncError)
            return new NextResponse(JSON.stringify({ error: "User sync failed. Please try again.", details: userSyncError }), { status: 500 })
        }

        // 2. Create a Series record first (if not exists or as part of flow)
        const { data: series, error: seriesError } = await supabase
            .from("series")
            .insert({
                user_id: userId,
                name: topic,
                topic: topic,
                style: style,
                frequency: "daily",
            })
            .select()
            .single()

        if (seriesError) throw seriesError

        // 3. Create the Video record
        const { data: video, error: videoError } = await supabase
            .from("videos")
            .insert({
                user_id: userId,
                series_id: (series as any).id,
                title: aiScript.title,
                script: aiScript.script,
                hook: aiScript.hook,
                caption: aiScript.caption,
                hashtags: aiScript.hashtags,
                style_preset: style,
                viral_score: aiScript.viral_score,
                status: "processing",
            })
            .select()
            .single()

        if (videoError) throw videoError

        // 4. Trigger Video Rendering (Background)
        // We don't await this to return the script ID fast to the UI
        renderVideo((video as any).id).catch(err => {
            console.error("[BACKGROUND_RENDER_TRIGGER_ERROR]", err)
        })

        return NextResponse.json({
            success: true,
            videoId: (video as any).id,
            message: "Script generated and processing started."
        })

    } catch (error: any) {
        console.error("[SCRIPT_GENERATION_ERROR]", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            stack: error.stack
        })
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}
