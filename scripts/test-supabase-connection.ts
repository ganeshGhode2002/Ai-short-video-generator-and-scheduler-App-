import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceRoleKey = envVars['NEXT_PUBLIC_SUPABASE_SERVICE_ROLE']; // Note: In .env.local it might be named differently, checking file content again if fail.

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_SERVICE_ROLE');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testSupabaseConnection() {
    console.log('Testing Supabase connection with Service Role key...');

    const testUser = {
        id: `test_user_${Date.now()}`,
        email: `test_user_${Date.now()}@example.com`,
        full_name: 'Test User',
        image_url: 'https://example.com/avatar.png',
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('users')
        .upsert(testUser)
        .select();

    if (error) {
        console.error('Error inserting user:', error);
    } else {
        console.log('Successfully inserted user:', data);

        // Clean up
        const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', testUser.id);

        if (deleteError) {
            console.error('Error cleaning up test user:', deleteError);
        } else {
            console.log('Successfully cleaned up test user.');
        }
    }
}

testSupabaseConnection();
