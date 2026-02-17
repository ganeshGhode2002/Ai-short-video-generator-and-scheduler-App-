import { createAdminClient } from "@/lib/supabase/admin";
import { fetchStockFootage } from "@/lib/pexels";

/**
 * Video Rendering Engine
 * Handles the high-level flow of turning a script into a video
 */
export async function renderVideo(videoId: string) {
    const supabase = createAdminClient() as any;

    try {
        console.log(`[VIDEO_ENGINE] Starting render for video: ${videoId}`);

        // 1. Fetch Video Record
        const { data: video, error: fetchError } = await supabase
            .from("videos")
            .select("*")
            .eq("id", videoId)
            .single();

        if (fetchError || !video) throw new Error("Video not found");

        // 2. Fetch Background Footage & Thumbnail from Pexels
        // Clean up the title or use a fallback for better search results
        const searchQuery = video.title?.split(':')[0] || "cinematic background";
        const { videoUrl: externalBackgroundUrl, thumbnailUrl } = await fetchStockFootage(searchQuery);

        console.log(`[VIDEO_ENGINE] Using assets for '${searchQuery}': Video: ${externalBackgroundUrl}, Thumb: ${thumbnailUrl}`);

        let finalVideoUrl = externalBackgroundUrl;

        // 3. Download the video and upload to Supabase Storage (S3)
        try {
            console.log(`[STORAGE_FIX] Re-hosting video: ${externalBackgroundUrl}`);
            const response = await fetch(externalBackgroundUrl);
            if (!response.ok) throw new Error(`External fetch failed: ${response.status}`);

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const fileName = `${video.user_id}/${videoId}.mp4`;

            const { error: uploadError } = await supabase.storage
                .from("videos")
                .upload(fileName, buffer, {
                    contentType: "video/mp4",
                    upsert: true
                });

            if (!uploadError) {
                const { data: signedData } = await supabase.storage
                    .from("videos")
                    .createSignedUrl(fileName, 31536000);

                if (signedData?.signedUrl) {
                    finalVideoUrl = signedData.signedUrl;
                }
            }
        } catch (downloadError) {
            console.error("[STORAGE_FIX] Re-hosting failure:", downloadError);
        }

        // 4. (Mock) Voiceover Generation
        const mockVoiceUrl = "https://www.learningcontainer.com/wp-content/uploads/2020/02/Sample-OGG-File.ogg";

        // 5. Update Video Record
        const { error: updateError } = await supabase
            .from("videos")
            .update({
                background_url: externalBackgroundUrl,
                video_url: finalVideoUrl,
                music_url: mockVoiceUrl,
                thumbnail_url: thumbnailUrl, // Dynamic thumbnail from Pexels
                status: "generated",
                updated_at: new Date().toISOString()
            })
            .eq("id", videoId);

        if (updateError) throw updateError;

        console.log(`[VIDEO_ENGINE] Render complete for: ${videoId}`);
        return { success: true };

    } catch (error) {
        console.error("[VIDEO_ENGINE_ERROR]", error);
        await supabase.from("videos").update({ status: "failed" }).eq("id", videoId);
        return { success: false, error };
    }
}
