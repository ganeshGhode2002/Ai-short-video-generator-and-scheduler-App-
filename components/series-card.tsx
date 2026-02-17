"use client"

import { useState } from "react"
import {
    CheckCircle2,
    Calendar,
    Pause,
    Play,
    Trash2,
    Loader2,
    Settings,
    MoreVertical,
    Plus,
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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { pauseSeries, resumeSeries, deleteSeries, createVideoFromSeries, updateSeries } from "@/app/actions/video-actions"

interface SeriesCardProps {
    series: {
        id: string
        name: string
        topic: string
        style: string
        frequency: string
        created_at: string
    }
}

export function SeriesCard({ series }: SeriesCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [editData, setEditData] = useState({
        name: series.name,
        topic: series.topic,
        style: series.style || "neutral",
        frequency: series.frequency
    })

    const isPaused = series.frequency === "paused"

    const handleTogglePause = async () => {
        setIsActionLoading(true)
        try {
            if (isPaused) {
                await resumeSeries(series.id)
                toast.success("Series resumed!")
            } else {
                await pauseSeries(series.id)
                toast.success("Series paused!")
            }
        } catch (err) {
            toast.error("Action failed")
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleAddVideo = async () => {
        setIsActionLoading(true)
        try {
            const result = await createVideoFromSeries(series.id)
            if (result.success) {
                toast.success("New video generation started!", {
                    description: "Check your Videos tab in a moment."
                })
            }
        } catch (err) {
            toast.error("Failed to start video generation")
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleUpdateSettings = async () => {
        setIsUpdating(true)
        try {
            await updateSeries(series.id, editData)
            toast.success("Series settings updated!")
            setIsSettingsOpen(false)
        } catch (err) {
            toast.error("Failed to update settings")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteSeries(series.id)
            toast.success("Series deleted successfully")
        } catch (err) {
            toast.error("Failed to delete series")
        } finally {
            setIsDeleting(false)
            setIsDeleteDialogOpen(false)
        }
    }

    return (
        <>
            <Card className="p-6 bg-card/50 backdrop-blur-md border-2 hover:border-primary/20 transition-all rounded-3xl group">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={isPaused ? "secondary" : "default"} className="rounded-lg">
                            {isPaused ? "Paused" : "Active"}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-2">
                                <DropdownMenuItem onClick={handleTogglePause} className="gap-2 rounded-lg">
                                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                                    {isPaused ? "Resume Series" : "Pause Series"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setIsSettingsOpen(true)}
                                    className="gap-2 rounded-lg"
                                >
                                    <Settings className="w-4 h-4" /> Edit Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className="gap-2 rounded-lg text-rose-500"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Series
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{series.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{series.topic}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Style</p>
                            <p className="text-sm font-medium capitalize">{series.style || "Default"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Frequency</p>
                            <p className="text-sm font-medium capitalize">{series.frequency}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            Created {new Date(series.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleAddVideo}
                                disabled={isActionLoading || isPaused}
                                className="rounded-xl h-8 text-xs font-semibold gap-2 border-2 shadow-lg shadow-primary/10"
                            >
                                {isActionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                Add Video
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl h-8 text-xs font-semibold"
                                onClick={handleTogglePause}
                                disabled={isActionLoading}
                            >
                                {isActionLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                                {isPaused ? "Resume" : "Pause"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-3xl border-2">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this series?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will also delete ALL videos associated with this series. This action cannot be undone.
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
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent className="rounded-3xl border-2 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            Series Settings
                        </DialogTitle>
                        <DialogDescription>
                            Update your automation preferences for this series.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Series Name</Label>
                            <Input
                                id="name"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="rounded-xl border-2 bg-accent/5"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="topic">Topic / Niche</Label>
                            <Input
                                id="topic"
                                value={editData.topic}
                                onChange={(e) => setEditData({ ...editData, topic: e.target.value })}
                                className="rounded-xl border-2 bg-accent/5"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Style</Label>
                                <Select
                                    value={editData.style}
                                    onValueChange={(val) => setEditData({ ...editData, style: val })}
                                >
                                    <SelectTrigger className="rounded-xl border-2 bg-accent/5">
                                        <SelectValue placeholder="Select Style" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-2">
                                        <SelectItem value="neutral">Neutral</SelectItem>
                                        <SelectItem value="aggressive">Aggressive</SelectItem>
                                        <SelectItem value="inspirational">Inspirational</SelectItem>
                                        <SelectItem value="educational">Educational</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Frequency</Label>
                                <Select
                                    value={editData.frequency || "daily"}
                                    onValueChange={(val) => setEditData({ ...editData, frequency: val })}
                                >
                                    <SelectTrigger className="rounded-xl border-2 bg-accent/5">
                                        <SelectValue placeholder="Select Frequency" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-2">
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                                        <SelectItem value="paused">Paused</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            className="w-full rounded-2xl h-12 font-bold shadow-xl shadow-primary/20 mt-2"
                            onClick={handleUpdateSettings}
                            disabled={isUpdating}
                        >
                            {isUpdating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                            Update Settings
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
