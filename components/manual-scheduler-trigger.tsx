"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Loader2 } from "lucide-react"
import { triggerSchedulerManual } from "@/app/actions/video-actions"
import { toast } from "sonner"

export function ManualSchedulerTrigger() {
    const [isLoading, setIsLoading] = useState(false)

    const handleTrigger = async () => {
        setIsLoading(true)
        try {
            const result = await triggerSchedulerManual()
            if (result.success) {
                toast.success("Scheduler triggered! New videos will start appearing soon.")
            }
        } catch (err) {
            toast.error("Failed to trigger scheduler")
        } finally {
            setIsLoading(true) // Keep loading state for a bit to show it's working
            setTimeout(() => setIsLoading(false), 2000)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="rounded-xl bg-accent/50 hover:bg-accent border-2 border-transparent hover:border-primary/20 gap-2 font-semibold transition-all h-10"
            onClick={handleTrigger}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Play className="w-4 h-4 text-primary fill-primary" />}
            {isLoading ? "Running Scheduler..." : "Run Scheduler Now"}
        </Button>
    )
}
