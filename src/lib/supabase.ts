// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 5 chars):', supabaseAnonKey.substring(0, 5));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Timeout error class
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Generic timeout wrapper for any Promise
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation: string = 'Operation'
): Promise<T> => {
  console.log(`withTimeout: Starting ${operation} with ${timeoutMs}ms timeout`);
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      console.log(`withTimeout: ${operation} timed out after ${timeoutMs}ms`);
      reject(new TimeoutError(`${operation} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
};