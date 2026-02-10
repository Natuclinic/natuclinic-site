
import { createClient } from '@supabase/supabase-js';

// Prioritize environment variables, but keep hardcoded as fallback for convenience
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dkjgskucppssvjvucmqy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRramdza3VjcHBzc3ZqdnVjbXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDA2NjAsImV4cCI6MjA3OTkxNjY2MH0.NqwEUwOdm2XZjPiDyfZnpB97CPWOP_yC1Z6coM4MVGo';

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
