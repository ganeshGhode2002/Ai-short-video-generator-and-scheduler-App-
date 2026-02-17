/**
 * Pexels API Service
 * Fetches stock footage based on topics
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export async function fetchStockFootage(query: string) {
    const fallback = {
        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
        thumbnailUrl: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    };

    if (!PEXELS_API_KEY) {
        console.warn("[PEXELS] API Key missing, returning placeholder.");
        return fallback;
    }

    try {
        // Optimized search: Fetch landscape oriented videos
        const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`, {
            headers: { Authorization: PEXELS_API_KEY }
        });

        if (!response.ok) throw new Error(`Pexels API responded with ${response.status}`);

        const data = await response.json();
        const video = data.videos?.[0];

        if (!video) {
            console.warn(`[PEXELS] No videos found for query: ${query}`);
            return fallback;
        }

        // Get the HD link and the video preview image
        const file = video.video_files.find((f: any) => f.quality === 'hd') || video.video_files[0];

        return {
            videoUrl: file.link,
            thumbnailUrl: video.image // Preview image from Pexels video object
        };
    } catch (error) {
        console.error("[PEXELS_ERROR]", error);
        return fallback;
    }
}
