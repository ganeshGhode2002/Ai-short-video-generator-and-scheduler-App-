import { NextResponse } from "next/server";
import { processAllAutomations } from "@/lib/scheduler";

/**
 * Cron Endpoint
 * This can be triggered by Vercel Cron or a simple web scraper/ping
 */
export async function GET(req: Request) {
    // Security Check: In production, verify a CRON_SECRET header
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new NextResponse("Unauthorized", { status: 401 });
    // }

    console.log("[CRON_JOB] Triggered at:", new Date().toISOString());

    // We don't await so the response is fast, processing happens in background
    processAllAutomations().catch(err => {
        console.error("[CRON_JOB_ERROR]", err);
    });

    return NextResponse.json({
        success: true,
        message: "Automation run started in background."
    });
}
