import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    // const broll = formData.get('broll') as string;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const supabase = createSupabaseServerClient();
    const { data: user } = await supabase.auth.getUser();

    try {
        // Save uploaded file
        const tempId = randomUUID();
        const inputPath = join(tmpdir(), `${tempId}-input.mp4`);
        const outputPath = join(tmpdir(), `${tempId}-output.mp4`);

        // Write file to temp
        const buffer = Buffer.from(await file.arrayBuffer());
        writeFileSync(inputPath, buffer);

        // Run Python script with B-roll
        execSync(`python scripts/process-video.py "${inputPath}" "${outputPath}"`, {
            stdio: 'inherit',
        });

        // Upload to Supabase Storage
        const outputBuffer = readFileSync(outputPath);
        const { data, error } = await supabase.storage
            .from('processed-videos')
            .upload(`${tempId}.mp4`, outputBuffer);

        if (error) throw error;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('processed-videos')
            .getPublicUrl(data.path);

        // Store metadata
        const { error: dbError } = await supabase.from('videos').insert({
            user_id: user?.user?.id,
            original_name: file.name,
            processed_url: data.path
        });

        if (dbError) throw dbError;

        // Clean up temporary files
        try {
            [inputPath, outputPath].forEach(path => {
                try {
                    if (path) {
                        readFileSync(path); // Check if file exists
                        writeFileSync(path, ''); // Clear file
                    }
                } catch (e) {
                    console.error('Error cleaning up temporary files:', e);
                }
            });
        } catch (e) {
            console.error('Error cleaning up temporary files:', e);
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