"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Step1ContentType } from "@/components/create-series/step-1-content-type"
import { Step2Topic } from "@/components/create-series/step-2-topic"
import { Step3Style } from "@/components/create-series/step-3-style"
import { Step4Duration } from "@/components/create-series/step-4-duration"
import { Step5Schedule } from "@/components/create-series/step-5-schedule"
import { Step6Confirm } from "@/components/create-series/step-6-confirm"

const totalSteps = 6

export function CreateSeriesWizard() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        contentType: "",
        topic: "",
        style: "",
        duration: "",
        scheduleTime: "10:00",
        platforms: [] as string[],
    })

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        if (currentStep === 1 && !formData.contentType) {
            toast.error("Please select a content type")
            return
        }
        if (currentStep === 2 && !formData.topic) {
            toast.error("Please enter a topic")
            return
        }
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1)
        } else {
            handleGenerate()
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/generate/script", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error("Failed to start generation")

            const data = await response.json()

            toast.success("Series created! Generating your first video in the background...", {
                icon: <Sparkles className="w-4 h-4 text-primary" />
            })

            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1ContentType selected={formData.contentType} onSelect={(id: string) => updateFormData("contentType", id)} />
            case 2:
                return <Step2Topic topic={formData.topic} onTopicChange={(val: string) => updateFormData("topic", val)} />
            case 3:
                return <Step3Style selected={formData.style} onSelect={(id: string) => updateFormData("style", id)} />
            case 4:
                return <Step4Duration selected={formData.duration} onSelect={(id: string) => updateFormData("duration", id)} />
            case 5:
                return (
                    <Step5Schedule
                        scheduleTime={formData.scheduleTime}
                        onTimeChange={(val: string) => updateFormData("scheduleTime", val)}
                        selectedPlatforms={formData.platforms}
                        onPlatformToggle={(id: string) => {
                            const current = [...formData.platforms]
                            if (current.includes(id)) {
                                updateFormData("platforms", current.filter(p => p !== id))
                            } else {
                                updateFormData("platforms", [...current, id])
                            }
                        }}
                    />
                )
            case 6:
                return <Step6Confirm data={formData} />
            default:
                return null
        }
    }

    const progress = (currentStep / totalSteps) * 100

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto">
            {/* Progress Bar Header */}
            <div className="mb-10 space-y-4">
                <div className="flex justify-between items-end text-sm font-medium uppercase tracking-widest text-muted-foreground px-1">
                    <span>Step {currentStep} of {totalSteps}</span>
                    <span className="text-primary">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2 bg-accent" />
            </div>

            {/* Main Form Content */}
            <div className="flex-1 overflow-y-auto px-1">
                {renderStep()}
            </div>

            {/* Navigation Footer */}
            <div className="mt-12 flex items-center justify-between py-6 border-t bg-background/80 backdrop-blur-md sticky bottom-0">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 1 || loading}
                    className="rounded-xl px-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={loading}
                    className="rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : currentStep === totalSteps ? (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Series
                        </>
                    ) : (
                        <>
                            Next Step
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
