"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wrench, Loader2 } from "lucide-react"
import { fixVideos } from "@/app/actions/video-actions"
import { toast } from "sonner"

export function RepairVideosButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleFix = async () => {
        setIsLoading(true)
        try {
            const result = await fixVideos()
            if (result.success) {
                toast.success(`Fixed ${result.fixedCount} videos! They should be playable now.`)
            }
        } catch (err) {
            toast.error("Failed to repair videos")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 border-2 hover:bg-primary/5 hover:border-primary/20 transition-all font-semibold"
            onClick={handleFix}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Wrench className="w-4 h-4 text-primary" />}
            {isLoading ? "Repairing..." : "Repair Broken Videos"}
        </Button>
    )
}
