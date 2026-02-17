import { createClient } from "@/lib/supabase/server"

/**
 * Background worker to check schedule table and process uploads
 * In a real production app, this would be a CRON job calling an API
 */
export async function processScheduledPosts() {
    const supabase = await createClient()
    const now = new Date().toISOString()

    // 1. Fetch pending schedules that should be posted now
    const { data: pending, error } = await supabase
        .from("schedules")
        .select("*, videos(*)")
        .eq("status", "pending")
        .lte("scheduled_time", now)

    if (error) {
        console.error("[SCHEDULER_FETCH_ERROR]", error)
        return
    }

    console.log(`[SCHEDULER] Found ${pending.length} pending posts.`)

    for (const item of pending) {
        try {
            // 2. Upload to selected platform (Mock logic for now)
            console.log(`[SCHEDULER] Posting video ${item.video_id} to ${item.platform}...`)

            // Update status to 'posted'
            await supabase
                .from("schedules")
                .update({ status: "posted", posted_at: new Date().toISOString() })
                .eq("id", item.id)

            await supabase
                .from("videos")
                .update({ status: "posted" })
                .eq("id", item.video_id)

        } catch (err: any) {
            console.error(`[SCHEDULER_POST_ERROR] ${item.id}:`, err)
            await supabase
                .from("schedules")
                .update({ status: "failed", error_message: err.message })
                .eq("id", item.id)
        }
    }
}
