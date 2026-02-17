import { SocialConnections } from "@/components/social-connections"
import { fetchSocialAccounts } from "@/app/actions/video-actions"

export default async function SettingsPage() {
    const connectedAccounts = await fetchSocialAccounts()

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-muted-foreground text-lg">
                    Configure your account, social media connections, and notification preferences.
                </p>
            </div>

            <div className="space-y-8 max-w-4xl">
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold tracking-tight">Social Media Connections</h3>
                    </div>
                    <SocialConnections connectedAccounts={connectedAccounts} />
                </section>

                <section className="p-6 rounded-3xl border bg-card/50 backdrop-blur-sm space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold tracking-tight">System Preferences</h3>
                        <p className="text-sm text-muted-foreground">Manage your automation and AI settings.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 rounded-xl border bg-accent/5 flex items-center justify-between">
                            <span className="font-medium">Auto-Subtitle Generation</span>
                            <div className="w-10 h-6 bg-primary rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border bg-accent/5 flex items-center justify-between">
                            <span className="font-medium">AI Viral Score Analysis</span>
                            <div className="w-10 h-6 bg-primary rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
