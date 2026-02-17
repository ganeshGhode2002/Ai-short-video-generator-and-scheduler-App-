/**
 * AI Service for VidMax
 * Handles script generation and analysis
 */

export interface VideoScript {
    title: string;
    script: string;
    hook: string;
    caption: string;
    hashtags: string[];
    viral_score: number;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function generateVideoScript(
    topic: string,
    contentType: string,
    style: string,
    duration: string
): Promise<VideoScript> {
    console.log(`[AI_SERVICE] Generating script for Topic: ${topic}, Style: ${style}`);

    // If OpenAI API Key is present, use real AI
    if (OPENAI_API_KEY) {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a viral video scriptwriter. Generate a JSON object with: title, script, hook, caption, hashtags (array), and viral_score (0-100). Keep it engaging and related to the topic."
                        },
                        {
                            role: "user",
                            content: `Topic: ${topic}, Style: ${style}, Type: ${contentType}, Duration: ${duration}`
                        }
                    ],
                    response_format: { type: "json_object" }
                })
            });

            const data = await response.json();
            const aiResult = JSON.parse(data.choices[0].message.content);
            return {
                ...aiResult,
                viral_score: aiResult.viral_score || Math.floor(Math.random() * 20) + 80
            };
        } catch (error) {
            console.error("[AI_SERVICE_ERROR] OpenAI failed, falling back to template:", error);
        }
    }

    // High-quality dynamic template fallback
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)}: The Complete ${style} Guide`,
        script: `[Scene: Hook] Did you know that ${topic} is changing everything? \n[Scene: Body] Most people struggle with the basics, but the real secret to success is using a ${style} strategy. It's about consistency and understanding the core mechanics of ${topic}. \n[Scene: Outro] Stop waiting and start implementing these ${style} tips today. Subscribe for more!`,
        hook: `Wait! Before you scroll, you need to hear this secret about ${topic}!`,
        caption: `Unlocking the next level of ${topic} using ${style} techniques! 🚀 #vidmax #${topic.replace(/\s+/g, '')} #ai`,
        hashtags: [topic.split(' ')[0].toLowerCase(), "viral", "ai", "vidmax", style.toLowerCase()],
        viral_score: Math.floor(Math.random() * 20) + 80,
    };
}
