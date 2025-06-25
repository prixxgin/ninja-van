// Supabase project credentials
const SUPABASE_URL = 'https://njogrxcjjqcojssmwaly.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2dyeGNqanFjb2pzc213YWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTg2NTQsImV4cCI6MjA2NTc5NDY1NH0.3Pn5EdJdm93mi5rCQS1vkNR_2U73GFtvSk5Vt7-eJPI';

// Initialize Supabase client
let supabaseClient;

async function initSupabase() {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
} 