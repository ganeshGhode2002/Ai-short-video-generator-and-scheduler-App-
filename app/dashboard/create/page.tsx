import { CreateSeriesWizard } from "@/components/create-series-wizard"

export const metadata = {
    title: "Create New Series | VidMax",
    description: "Start a new automated short video series.",
}

export default function CreateSeriesPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Series</h1>
                <p className="text-muted-foreground text-lg">
                    Follow the steps below to setup your automated viral content factory.
                </p>
            </div>

            <div className="bg-card/30 border-2 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden shadow-2xl">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <CreateSeriesWizard />
            </div>
        </div>
    )
}
