/**
 * ARISE Configuration Template
 *
 * INSTRUCTIONS:
 * 1. Copy this file to 'config.js' (in the same directory)
 * 2. Replace the placeholder values with your actual Supabase credentials
 * 3. NEVER commit config.js to git (it's in .gitignore)
 *
 * Get your credentials from: https://app.supabase.com/project/_/settings/api
 */

const CONFIG = {
    SUPABASE_URL: 'https://your-project-id.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key-here'
};

// For ES6 modules
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
