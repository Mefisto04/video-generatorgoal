import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

// Client-side Supabase client
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase client with build-time safety
export function createSupabaseServerClient() {
    // Check if we're in a build environment
    const isServerBuild = process.env.VERCEL_ENV === 'build' || process.env.NODE_ENV === 'test';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // If we're in a build environment or missing credentials, return a mock client
    if (isServerBuild || !supabaseUrl || !supabaseKey) {
        if (!isServerBuild) {
            console.warn('Supabase credentials not available. Using mock client.');
        }

        // Return a mock client that won't throw errors during build
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null })
            },
            storage: {
                from: () => ({
                    upload: async () => ({ data: { path: 'mock-path' }, error: null }),
                    getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/mock-video.mp4' } })
                })
            },
            from: () => ({
                insert: async () => ({ error: null }),
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: null, error: null })
                    })
                })
            })
        } as unknown as ReturnType<typeof createClient<Database>>;
    }

    // Return a real Supabase client
    return createClient<Database>(supabaseUrl, supabaseKey);
}