import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ixvfzwimjezkgkqkruqg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dmZ6d2ltamV6a2drcWtydXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzMzMzQsImV4cCI6MjA3NTUwOTMzNH0.KHJAXF1SsbCBNUQY2_TObVdg7WpKu12So8-s49Ttah0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);