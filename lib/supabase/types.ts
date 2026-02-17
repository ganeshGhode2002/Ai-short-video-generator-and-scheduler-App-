export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    image_url: string | null
                    subscription_tier: string
                    stripe_customer_id: string | null
                    credits: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    image_url?: string | null
                    subscription_tier?: string
                    stripe_customer_id?: string | null
                    credits?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    image_url?: string | null
                    subscription_tier?: string
                    stripe_customer_id?: string | null
                    credits?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            series: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    topic: string
                    style: string | null
                    frequency: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    topic: string
                    style?: string | null
                    frequency?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    topic?: string
                    style?: string | null
                    frequency?: string | null
                    created_at?: string
                }
            }
            videos: {
                Row: {
                    id: string
                    user_id: string
                    series_id: string | null
                    title: string | null
                    script: string | null
                    hook: string | null
                    caption: string | null
                    hashtags: string[] | null
                    video_url: string | null
                    thumbnail_url: string | null
                    voice_id: string | null
                    background_url: string | null
                    music_url: string | null
                    style_preset: string | null
                    viral_score: number | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    series_id?: string | null
                    title?: string | null
                    script?: string | null
                    hook?: string | null
                    caption?: string | null
                    hashtags?: string[] | null
                    video_url?: string | null
                    thumbnail_url?: string | null
                    voice_id?: string | null
                    background_url?: string | null
                    music_url?: string | null
                    style_preset?: string | null
                    viral_score?: number | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    series_id?: string | null
                    title?: string | null
                    script?: string | null
                    hook?: string | null
                    caption?: string | null
                    hashtags?: string[] | null
                    video_url?: string | null
                    thumbnail_url?: string | null
                    voice_id?: string | null
                    background_url?: string | null
                    music_url?: string | null
                    style_preset?: string | null
                    viral_score?: number | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            social_accounts: {
                Row: {
                    id: string
                    user_id: string
                    platform: string
                    account_name: string | null
                    access_token: string | null
                    refresh_token: string | null
                    expires_at: string | null
                    connected_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    platform: string
                    account_name?: string | null
                    access_token?: string | null
                    refresh_token?: string | null
                    expires_at?: string | null
                    connected_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    platform?: string
                    account_name?: string | null
                    access_token?: string | null
                    refresh_token?: string | null
                    expires_at?: string | null
                    connected_at?: string
                }
            }
            schedules: {
                Row: {
                    id: string
                    video_id: string
                    user_id: string
                    platform: string
                    scheduled_time: string
                    status: string
                    posted_at: string | null
                    error_message: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    video_id: string
                    user_id: string
                    platform: string
                    scheduled_time: string
                    status?: string
                    posted_at?: string | null
                    error_message?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    video_id?: string
                    user_id?: string
                    platform?: string
                    scheduled_time?: string
                    status?: string
                    posted_at?: string | null
                    error_message?: string | null
                    created_at?: string
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    stripe_subscription_id: string | null
                    status: string
                    current_period_end: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    stripe_subscription_id?: string | null
                    status: string
                    current_period_end?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    stripe_subscription_id?: string | null
                    status?: string
                    current_period_end?: string | null
                    created_at?: string
                }
            }
        }
    }
}
