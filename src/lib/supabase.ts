// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('Supabase URL:', supabaseUrl); // Add this line
console.log('Supabase Anon Key (first 5 chars):', supabaseAnonKey.substring(0, 5)); // Add this line

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
