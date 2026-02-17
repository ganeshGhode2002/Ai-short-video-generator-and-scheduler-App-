import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { renderVideo } from "@/lib/video-engine"

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        const { videoId } = await req.json()

        // 1. Call the Unified Rendering Engine
        const result = await renderVideo(videoId)

        if (!result.success) {
            return new NextResponse(result.error?.toString() || "Render failed", { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: "Video generation complete via Unified Engine."
        })

    } catch (error: any) {
        console.error("[API_GENERATE_VIDEO_ERROR]", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}
