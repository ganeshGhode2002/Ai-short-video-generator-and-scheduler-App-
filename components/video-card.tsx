"use client"

import { useState } from "react"
import {
    Play,
    CheckCircle2,
    Clock,
    AlertCircle,
    Share2,
    MoreVertical,
    Download,
    Trash2,
    Loader2,
    X,
    CalendarDays,
    Youtube,
    Instagram,
    Music2,
    Settings2,
    Sparkles
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { deleteVideo, scheduleVideo, updateVideoAndRender } from "@/app/actions/video-actions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface VideoCardProps {
    video: any
}

const platforms = [
    { id: "youtube", name: "YouTube", icon: Youtube },
    { id: "instagram", name: "Instagram", icon: Instagram },
    { id: "tiktok", name: "TikTok", icon: Music2 },
]

export function VideoCard({ video }: VideoCardProps) {
    const router = useRouter()
    const [isPlayerOpen, setIsPlayerOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isScheduleOpen, setIsScheduleOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isScheduling, setIsScheduling] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState("youtube")
    const [scheduleTime, setScheduleTime] = useState("")
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [editData, setEditData] = useState({
        title: video.title || "",
        hook: video.hook || "",
        script: video.script || "",
        caption: video.caption || ""
    })

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "generated": return "default"
            case "processing": return "secondary"
            case "failed": return "destructive"
            default: return "outline"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "generated": return <CheckCircle2 className="w-3 h-3 mr-1" />
            case "processing": return <Clock className="w-3 h-3 mr-1 animate-pulse" />
            case "failed": return <AlertCircle className="w-3 h-3 mr-1" />
            default: return null
        }
    }

    const handleShare = async () => {
        if (!video.video_url) {
            toast.error("Video URL not available yet")
            return
        }
        try {
            await navigator.clipboard.writeText(video.video_url)
            toast.success("Link copied to clipboard!")
        } catch (err) {
            toast.error("Failed to copy link")
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteVideo(video.id)
            if (result.success) {
                toast.success("Video deleted successfully")
                router.refresh()
            } else {
                toast.error("Failed to delete video")
            }
        } catch (err) {
            toast.error("An error occurred while deleting")
        } finally {
            setIsDeleting(false)
            setIsDeleteDialogOpen(false)
        }
    }

    const handleSchedule = async () => {
        if (!scheduleTime) {
            toast.error("Please select a time")
            return
        }
        setIsScheduling(true)
        try {
            await scheduleVideo(video.id, selectedPlatform, new Date(scheduleTime))
            toast.success(`Video scheduled for ${selectedPlatform}!`)
            setIsScheduleOpen(false)
            router.refresh()
        } catch (err) {
            toast.error("Failed to schedule video")
        } finally {
            setIsScheduling(false)
        }
    }

    const handleUpdate = async () => {
        setIsUpdating(true)
        try {
            const result = await updateVideoAndRender(video.id, editData)
            if (result.success) {
                toast.success("Video updated & re-rendering started!", {
                    description: "Your changes will be live in a few moments."
                })
                setIsEditOpen(false)
                router.refresh()
            }
        } catch (err) {
            toast.error("Failed to update video")
        } finally {
            setIsUpdating(false)
        }
    }
    const handleDownload = () => {
        if (!video.video_url) {
            toast.error("Download not available yet")
            return
        }
        window.open(video.video_url, '_blank')
    }

    return (
        <>
            <Card className="group overflow-hidden rounded-3xl border-2 hover:border-primary/20 transition-all bg-card/50 backdrop-blur-md">
                {/* Video Preview / Placeholder */}
                <div className="relative aspect-video bg-accent/20 overflow-hidden">
                    {video.thumbnail_url ? (
                        <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-accent/50 to-background gap-3">
                            <SparklesIcon className="w-8 h-8 text-primary/40 animate-pulse" />
                            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">AI Rendering...</span>
                        </div>
                    )}
                    <div className="absolute top-3 left-3">
                        <Badge variant={getStatusVariant(video.status)} className="rounded-lg backdrop-blur-md bg-opacity-80 px-2 py-0.5">
                            {getStatusIcon(video.status)}
                            <span className="capitalize">{video.status}</span>
                        </Badge>
                    </div>
                    {video.status === 'generated' && (
                        <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-sm cursor-pointer"
                            onClick={() => setIsPlayerOpen(true)}
                        >
                            <Button size="icon" className="rounded-full w-12 h-12 shadow-2xl bg-primary hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 fill-current ml-1" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="p-5 space-y-3">
                    <div>
                        <p className="text-[10px] uppercase tracking-tighter text-primary font-bold mb-1">
                            {video.series?.name || 'Quick Video'}
                        </p>
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                            {video.title || "Generating title..."}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex -space-x-1 items-center">
                            <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[8px] font-bold text-primary">VS</div>
                            <span className="text-xs font-medium ml-2 text-muted-foreground">
                                {video.viral_score ? `${video.viral_score}% Viral` : 'Analyzing...'}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                onClick={handleShare}
                                disabled={!video.video_url}
                            >
                                <Share2 className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-2 p-1 min-w-[160px]">
                                    <DropdownMenuItem
                                        className="rounded-lg gap-2 cursor-pointer"
                                        onClick={() => setIsEditOpen(true)}
                                    >
                                        <Settings2 className="w-4 h-4" /> Edit Content
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="rounded-lg gap-2 cursor-pointer"
                                        onClick={() => setIsScheduleOpen(true)}
                                        disabled={video.status !== 'generated'}
                                    >
                                        <CalendarDays className="w-4 h-4" /> Schedule Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="rounded-lg gap-2 cursor-pointer"
                                        onClick={() => setIsPlayerOpen(true)}
                                        disabled={!video.video_url}
                                    >
                                        <Play className="w-4 h-4" /> Play Video
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="rounded-lg gap-2 cursor-pointer"
                                        onClick={handleDownload}
                                        disabled={!video.video_url}
                                    >
                                        <Download className="w-4 h-4" /> Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="rounded-lg gap-2 text-rose-500 cursor-pointer focus:text-rose-500 focus:bg-rose-500/10"
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete Video
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Edit Content Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="rounded-3xl border-2 max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-primary" />
                            Customize Your Video
                        </DialogTitle>
                        <DialogDescription>
                            Modify the script and metadata. Saving will trigger a new render with matching stock footage.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Video Title</Label>
                            <Input
                                id="title"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="rounded-xl border-2 bg-accent/5 focus:bg-background"
                                placeholder="E.g. 5 Tips for Gym Success"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hook">Engaging Hook</Label>
                            <Input
                                id="hook"
                                value={editData.hook}
                                onChange={(e) => setEditData({ ...editData, hook: e.target.value })}
                                className="rounded-xl border-2 bg-accent/5 focus:bg-background"
                                placeholder="E.g. Stop doing this at the gym!"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="script">Full Script</Label>
                            <Textarea
                                id="script"
                                value={editData.script}
                                onChange={(e) => setEditData({ ...editData, script: e.target.value })}
                                className="rounded-xl border-2 bg-accent/5 focus:bg-background h-32"
                                placeholder="Enter the full video script..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="caption">Social Caption & Hashtags</Label>
                            <Textarea
                                id="caption"
                                value={editData.caption}
                                onChange={(e) => setEditData({ ...editData, caption: e.target.value })}
                                className="rounded-xl border-2 bg-accent/5 focus:bg-background h-24"
                                placeholder="E.g. Level up your workouts! #gym #fitness"
                            />
                        </div>

                        <div className="pt-2 flex flex-col gap-3">
                            <Button
                                className="w-full rounded-2xl h-12 font-bold shadow-xl shadow-primary/20 text-md"
                                onClick={handleUpdate}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <Sparkles className="w-5 h-5 mr-2" />
                                )}
                                {isUpdating ? "Processing..." : "Save & Regenerate Video"}
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-semibold italic">
                                Note: This will use 1 credit and find new matching stock footage.
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                <DialogContent className="rounded-3xl border-2 max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Schedule Post</DialogTitle>
                        <DialogDescription>
                            Choose when and where to post your video.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold">Select Platform</p>
                            <div className="grid grid-cols-3 gap-3">
                                {platforms.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPlatform(p.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2 ${selectedPlatform === p.id
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-transparent bg-accent/5 hover:bg-accent/10"
                                            }`}
                                    >
                                        <p.icon className="w-6 h-6" />
                                        <span className="text-[10px] font-bold uppercase">{p.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold">Scheduled Time</p>
                            <input
                                type="datetime-local"
                                className="w-full p-3 rounded-2xl bg-accent/50 border-2 border-transparent focus:border-primary/20 outline-none"
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full rounded-2xl h-12 font-bold shadow-xl shadow-primary/20"
                            onClick={handleSchedule}
                            disabled={isScheduling}
                        >
                            {isScheduling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CalendarDays className="w-4 h-4 mr-2" />}
                            Schedule Now
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Video Player Modal */}
            <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none rounded-3xl shadow-2xl">
                    <DialogHeader className="p-0">
                        <DialogTitle className="sr-only">{video.title || "Video Player"}</DialogTitle>
                        <DialogDescription className="sr-only">
                            Watch your generated video content.
                        </DialogDescription>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full bg-black/50 text-white hover:bg-black/70 z-50">
                                <X className="w-5 h-5" />
                            </Button>
                        </DialogClose>
                    </DialogHeader>
                    <div className="aspect-video w-full flex items-center justify-center bg-black">
                        {video.video_url ? (
                            <video
                                src={video.video_url}
                                controls
                                autoPlay
                                playsInline
                                muted
                                crossOrigin="anonymous"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    console.error("Video loading error:", e);
                                    toast.error("Video failed to load. Try the 'Repair' tool.");
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-white/60">
                                <AlertCircle className="w-12 h-12" />
                                <p className="text-lg font-medium">Video URL not found</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-3xl border-2">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your video from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Delete Video
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

function SparklesIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    )
}
