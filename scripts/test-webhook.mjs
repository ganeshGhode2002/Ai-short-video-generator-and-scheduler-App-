
import { Webhook } from 'svix';
import fs from 'fs';
import path from 'path';

// Read .env.local to get CLERK_WEBHOOK_SECRET
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/CLERK_WEBHOOK_SECRET=(.*)/);

if (!match) {
    console.error('CLERK_WEBHOOK_SECRET not found in .env.local');
    process.exit(1);
}

const secret = match[1].trim();

const payload = {
    "data": {
        "email_addresses": [
            {
                "email_address": "test_user_simulated@example.com",
                "id": "idn_12345",
                "linked_to": [],
                "object": "email_address",
                "verification": {
                    "status": "verified",
                    "strategy": "ticket"
                }
            }
        ],
        "first_name": "Test",
        "id": "user_simulated_123",
        "image_url": "https://img.clerk.com/preview.png",
        "last_name": "Simulation",
        "object": "user",
        // ... other fields omit for brevity
    },
    "object": "event",
    "type": "user.created"
};

const body = JSON.stringify(payload);

const wh = new Webhook(secret);
const timestamp = Math.floor(Date.now() / 1000);
// Generate valid headers
const headers = wh.sign(body, new Date(timestamp * 1000));

console.log("Sending simulated webhook to http://localhost:3000/api/webhooks/clerk");

fetch('http://localhost:3000/api/webhooks/clerk', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        ...headers
    },
    body: body
}).then(async (res) => {
    console.log(`Response Status: ${res.status}`);
    const text = await res.text();
    console.log(`Response Body: ${text}`);
}).catch((err) => {
    console.error('Error sending webhook:', err);
});
