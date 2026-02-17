"use server"

import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { generateVideoScript } from "@/lib/ai"
import { renderVideo } from "@/lib/video-engine"
import { fetchStockFootage } from "@/lib/pexels"

export async function deleteVideo(videoId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    console.log(`[ACTION] Attempting to delete video: ${videoId} for user: ${userId}`)

    const supabase = createAdminClient() as any
    const { data, error, count } = await supabase
        .from("videos")
        .delete({ count: 'exact' })
        .eq("id", videoId)
        .eq("user_id", userId)

    if (error) {
        console.error("[ACTION] Delete video error:", error)
        throw error
    }

    console.log(`[ACTION] Delete video success. Rows affected: ${count}`)

    revalidatePath("/dashboard/videos")
    return { success: true, count }
}

export async function pauseSeries(seriesId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const supabase = createAdminClient() as any
    const { error } = await supabase
        .from("series")
        .update({ frequency: "paused" })
        .eq("id", seriesId)
        .eq("user_id", userId)

    if (error) throw error
    revalidatePath("/dashboard/series")
    return { success: true }
}

export async function resumeSeries(seriesId: string, frequency: string = "daily") {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const supabase = createAdminClient() as any
    const { error } = await supabase
        .from("series")
        .update({ frequency })
        .eq("id", seriesId)
        .eq("user_id", userId)

    if (error) throw error
    revalidatePath("/dashboard/series")
    return { success: true }
}

export async function deleteSeries(seriesId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const supabase = createAdminClient() as any
    const { error } = await supabase
        .from("series")
        .delete()
        .eq("id", seriesId)
        .eq("user_id", userId)

    if (error) throw error
    revalidatePath("/dashboard/series")
    return { success: true }
}

import { processAllAutomations } from "@/lib/scheduler"

export async function triggerSchedulerManual() {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // This can be a long running process, but since it's an MVP 
    // we'll wait for it or trigger it and return
    // For better UX, this should ideally be a background job
    processAllAutomations().catch(err => {
        console.error("[MANUAL_SCHEDULER_ERROR]", err)
    })

    return { success: true, message: "Scheduler triggered successfully" }
}

export async function fixVideos() {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    console.log(`[ACTION] Fixing videos for user: ${userId}`)
    const supabase = createAdminClient() as any

    // Find all 'generated' videos for the user
    const { data: videos, error: fetchError } = await supabase
        .from("videos")
        .select("id, background_url, video_url, title, thumbnail_url, user_id, viral_score")
        .eq("user_id", userId)
        .eq("status", "generated")

    if (fetchError) throw fetchError

    console.log(`[ACTION] Checking ${videos?.length || 0} videos for repairs`)

    let fixedCount = 0
    for (const video of (videos || [])) {
        const shouldFix = !video.video_url ||
            video.video_url.includes("example.com") ||
            video.video_url.includes("mock-video") ||
            video.video_url === "" ||
            video.video_url?.includes("mixkit") ||
            video.video_url?.includes("pexels") ||
            video.video_url?.includes("oceans.mp4");

        if (shouldFix) {
            // Aggressive fix: If video_url is broken, try to use background_url or fallback
            // NEW: Try to move to Supabase Storage for permanent fix if it's an external URL
            let finalUrl = video.background_url || "https://vjs.zencdn.net/v/oceans.mp4";

            if (finalUrl.includes("mixkit") || finalUrl.includes("pexels") || finalUrl.includes("oceans.mp4")) {
                console.log(`[DIAGNOSTIC] Migrating ${video.id} from ${finalUrl}...`);
                try {
                    const response = await fetch(finalUrl);
                    if (response.ok) {
                        const arrayBuffer = await response.arrayBuffer();
                        const fileName = `${video.user_id}/${video.id}.mp4`;

                        console.log(`[DIAGNOSTIC] File fetched. Size: ${arrayBuffer.byteLength}. Uploading...`);

                        const { data, error: uploadError } = await supabase.storage
                            .from("videos")
                            .upload(fileName, Buffer.from(arrayBuffer), {
                                contentType: "video/mp4",
                                upsert: true
                            });

                        if (!uploadError) {
                            // Generate a Signed URL for 1 year
                            const { data: signedData } = await supabase.storage
                                .from("videos")
                                .createSignedUrl(fileName, 31536000);

                            if (signedData?.signedUrl) {
                                finalUrl = signedData.signedUrl;
                                console.log(`[DIAGNOSTIC] Success! New Signed URL: ${finalUrl}`);
                            }
                        } else {
                            console.error(`[DIAGNOSTIC] Upload FAILED for ${video.id}:`, uploadError);
                        }
                    } else {
                        console.error(`[DIAGNOSTIC] Fetch FAILED for ${finalUrl}: ${response.status}`);
                    }
                } catch (e) {
                    console.error(`[DIAGNOSTIC] REPAIR CRITICAL ERROR:`, e);
                }
            }

            let currentThumbnail = video.thumbnail_url;
            const isRobotThumb = currentThumbnail?.includes("2599244"); // Robot ID from search results earlier

            if (isRobotThumb || !currentThumbnail) {
                console.log(`[DIAGNOSTIC] Repairing thumbnail for ${video.id}...`);
                const searchQuery = video.title?.split(':')[0] || "cinematic";
                const { thumbnailUrl } = await fetchStockFootage(searchQuery);
                currentThumbnail = thumbnailUrl;
            }

            const { error: updateError } = await supabase
                .from("videos")
                .update({
                    video_url: finalUrl,
                    thumbnail_url: currentThumbnail,
                    viral_score: video.viral_score || Math.floor(Math.random() * 40) + 60,
                    updated_at: new Date().toISOString()
                })
                .eq("id", video.id)

            if (!updateError) fixedCount++
        }
    }

    console.log(`[ACTION] Fixed ${fixedCount} videos`)
    revalidatePath("/dashboard/videos")
    return { success: true, fixedCount }
}

export async function connectSocialAccount(platform: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const supabase = createAdminClient() as any
    const { error } = await supabase
        .from("social_accounts")
        .insert({
            user_id: userId,
            platform,
            account_name: `Connected ${platform}`
        })

    if (error) throw error
    revalidatePath("/dashboard/settings")
    return { success: true }
}

export async function disconnectSocialAccount(accountId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const supabase = createAdminClient() as any
    const { error } = await supabase
        .from("social_accounts")
        .delete()
        .eq("id", accountId)
        .eq("user_id", userId)

    if (error) throw error
    revalidatePath("/dashboard/settings")
    return { success: true }
}

export async function scheduleVideo(videoId: string, platform: string, scheduledTime: Date) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const supabase = createAdminClient() as any
    const { error } = await supabase
        .from("schedules")
        .insert({
            user_id: userId,
            video_id: videoId,
            platform,
            scheduled_time: scheduledTime.toISOString(),
            status: "pending"
        })

    if (error) throw error
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/videos")
    return { success: true }
}

export async function fetchSocialAccounts() {
    const { userId } = await auth()
    if (!userId) return []

    const supabase = createAdminClient() as any
    const { data } = await supabase
        .from("social_accounts")
        .select("*")
        .eq("user_id", userId)

    return data || []
}

export async function createVideoFromSeries(seriesId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const supabase = createAdminClient() as any

    // 1. Fetch Series Meta
    const { data: series, error: seriesError } = await supabase
        .from("series")
        .select("*")
        .eq("id", seriesId)
        .eq("user_id", userId)
        .single()

    if (seriesError || !series) throw new Error("Series not found")

    // 2. Generate AI Script
    const aiScript = await generateVideoScript(
        series.topic,
        "video", // default
        series.style || "neutral",
        "medium" // default
    )

    // 3. Create Video Record
    const { data: video, error: videoError } = await supabase
        .from("videos")
        .insert({
            user_id: userId,
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
        .single()

    if (videoError) throw videoError

    // 4. Trigger Rendering
    renderVideo((video as any).id).catch(err => {
        console.error("[ACTION_ADD_VIDEO_ERROR]", err)
    })

    revalidatePath("/dashboard/videos")
    revalidatePath("/dashboard")
    return { success: true, videoId: (video as any).id }
}

export async function updateVideoAndRender(videoId: string, updates: any) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const supabase = createAdminClient() as any

    // 1. Update Video Record
    const { error: updateError } = await supabase
        .from("videos")
        .update({
            ...updates,
            status: "processing", // Mark as processing for re-render
            updated_at: new Date().toISOString()
        })
        .eq("id", videoId)
        .eq("user_id", userId)

    if (updateError) throw updateError

    // 2. Trigger Rendering Engine
    // This will pick up the new title/content and fetch matching stock footage
    renderVideo(videoId).catch(err => {
        console.error("[ACTION_UPDATE_RENDER_ERROR]", err)
    })

    revalidatePath("/dashboard/videos")
    revalidatePath("/dashboard")
    return { success: true }
}

export async function updateSeries(seriesId: string, updates: any) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const supabase = createAdminClient() as any
    const { error } = await supabase
        .from("series")
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq("id", seriesId)
        .eq("user_id", userId)

    if (error) throw error

    revalidatePath("/dashboard/series")
    revalidatePath("/dashboard")
    return { success: true }
}
