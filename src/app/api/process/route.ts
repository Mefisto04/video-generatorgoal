import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { randomUUID } from 'crypto';

const VIDEO_PROCESSOR_URL = process.env.VIDEO_PROCESSOR_URL || 'http://localhost:8000';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const broll = formData.get('broll') as string;

        if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

        const supabase = createSupabaseServerClient();
        const { data: user } = await supabase.auth.getUser();

        // Create a new FormData for the request to the video processor
        const processorFormData = new FormData();
        processorFormData.append('file', file);
        if (broll) {
            processorFormData.append('broll', broll);
        }

        // Process the video using the deployed processor service
        console.log(`Sending video to processor at ${VIDEO_PROCESSOR_URL}/process`);
        const processorResponse = await fetch(`${VIDEO_PROCESSOR_URL}/process`, {
            method: 'POST',
            body: processorFormData,
        });

        if (!processorResponse.ok) {
            const errorData = await processorResponse.json();
            console.error('Video processor error:', errorData);
            return NextResponse.json(
                { error: 'Video processing failed', details: errorData },
                { status: 500 }
            );
        }

        // Get the processed video as a blob
        const processedVideoBlob = await processorResponse.blob();

        // Generate a unique ID for the video
        const videoId = randomUUID();

        // Upload the processed video to Supabase Storage
        const { data, error } = await supabase.storage
            .from('processed-videos')
            .upload(`${videoId}.mp4`, processedVideoBlob);

        if (error) {
            console.error('Supabase storage error:', error);
            throw error;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('processed-videos')
            .getPublicUrl(data.path);

        // Store metadata in Supabase
        const { error: dbError } = await supabase.from('videos').insert({
            user_id: user?.user?.id,
            original_name: file.name,
            processed_url: data.path
        });

        if (dbError) {
            console.error('Supabase database error:', dbError);
            throw dbError;
        }

        return NextResponse.json({
            success: true,
            videoUrl: publicUrl
        });

    } catch (error) {
        console.error('Processing error:', error);
        return NextResponse.json(
            { error: 'Video processing failed', details: error },
            { status: 500 }
        );
    }
}