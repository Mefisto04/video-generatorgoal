import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create Supabase client with error handling for build time
function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase credentials not available during build');
        // Return a mock client for build time
        return {
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: null, error: null })
                    })
                })
            })
        };
    }

    return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: Request) {
    try {
        const supabase = getSupabaseClient();
        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get('id');

        if (!videoId) {
            return NextResponse.json(
                { error: 'Video ID is required' },
                { status: 400 }
            );
        }

        // Skip database query during build time
        if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'build') {
            return NextResponse.json({
                url: 'https://example.com/placeholder-during-build.mp4',
                captions: 'Placeholder captions during build',
                status: 'build'
            });
        }

        const { data, error } = await supabase
            .from('processed_videos')
            .select('*')
            .eq('id', videoId)
            .single();

        if (error) {
            console.error('Error fetching video:', error);
            return NextResponse.json(
                { error: 'Failed to fetch video' },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { error: 'Video not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            url: data.url,
            captions: data.captions,
            status: data.status
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 