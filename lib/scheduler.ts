import { createAdminClient } from "@/lib/supabase/admin";
import { renderVideo } from "@/lib/video-engine";
import { generateVideoScript } from "@/lib/ai";

/**
 * Scheduler Engine
 * Handles recurring automation tasks
 */

export async function processAllAutomations() {
    const supabase = createAdminClient() as any;
    console.log("[SCHEDULER] Starting global automation run...");

    try {
        // 1. Fetch all active series
        const { data: activeSeries, error } = await supabase
            .from("series")
            .select("*");

        if (error) throw error;
        if (!activeSeries || activeSeries.length === 0) {
            console.log("[SCHEDULER] No active series found.");
            return;
        }

        for (const series of activeSeries) {
            console.log(`[SCHEDULER] Processing series: ${series.name} (ID: ${series.id})`);

            // Check if we should generate a video today (Frequency check)
            // For MVP, we'll just check if one was already generated in the last 24h
            const { data: recentVideos } = await supabase
                .from("videos")
                .select("created_at")
                .eq("series_id", series.id)
                .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

            if (recentVideos && recentVideos.length > 0) {
                console.log(`[SCHEDULER] Skipping ${series.name} - already generated today.`);
                continue;
            }

            // 2. Trigger AI Generation Flow
            console.log(`[SCHEDULER] Generating new video for ${series.name}...`);

            // a. Generate Script
            const aiScript = await generateVideoScript(
                series.topic,
                "Short", // Default type
                series.style,
                "60s" // Default duration
            );

            // b. Create Video Record
            const { data: video, error: videoError } = await supabase
                .from("videos")
                .insert({
                    user_id: series.user_id,
                    series_id: series.id,
                    title: aiScript.title,
                    script: aiScript.script,
                    hook: aiScript.hook,
                    caption: aiScript.caption,
                    hashtags: aiScript.hashtags,
                    style_preset: series.style,
                    viral_score: aiScript.viral_score,
                    status: "processing",
                })
                .select()
                .single();

            if (videoError) {
                console.error(`[SCHEDULER_ERROR] Failed to create video for ${series.name}:`, videoError);
                continue;
            }

            // c. Trigger Rendering
            renderVideo(video.id).catch(err => {
                console.error(`[SCHEDULER_ERROR] Rendering failed for ${video.id}:`, err);
            });
        }

        // 3. Process Scheduled Posts
        await processSchedules();

    } catch (error) {
        console.error("[SCHEDULER_CRITICAL_ERROR]", error);
    }
}

export async function processSchedules() {
    const supabase = createAdminClient() as any;
    console.log("[SCHEDULER] Checking for pending posts...");

    try {
        const { data: pendingSchedules, error } = await supabase
            .from("schedules")
            .select("*")
            .eq("status", "pending")
            .lte("scheduled_time", new Date().toISOString());

        if (error) throw error;
        if (!pendingSchedules || pendingSchedules.length === 0) {
            console.log("[SCHEDULER] No pending posts ready for publishing.");
            return;
        }

        for (const schedule of pendingSchedules) {
            console.log(`[SCHEDULER] Publishing video ${schedule.video_id} to ${schedule.platform}...`);

            // In a real app, this is where you'd call the YouTube/Instagram API
            // For MVP, we'll simulate a successful post

            const { error: updateError } = await supabase
                .from("schedules")
                .update({
                    status: "posted",
                    updated_at: new Date().toISOString()
                })
                .eq("id", schedule.id);

            if (updateError) {
                console.error(`[SCHEDULER_ERROR] Failed to update schedule ${schedule.id}:`, updateError);
            } else {
                console.log(`[SCHEDULER] Successfully posted ${schedule.video_id} to ${schedule.platform}`);
            }
        }
    } catch (error) {
        console.error("[SCHEDULER_PROCESS_SCHEDULES_ERROR]", error);
    }
}
