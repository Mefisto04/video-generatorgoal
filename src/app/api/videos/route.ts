import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get('id');

        if (!videoId) {
            return NextResponse.json(
                { error: 'Video ID is required' },
                { status: 400 }
            );
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