import whisper
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, ImageClip
import tempfile
import os
import requests

# Configuration
MAX_BROLLS = 5  # Set to 3, 4, or 5 as needed
API_KEY = "ShPi9rwkDqPCc543pHDTpVYbuFdXEvsWa9uOJyymDQLtnsNMnBPYbHsk"

print("🚀 Starting video processing pipeline...")

# Load video
print("📹 Loading video file...")
video = VideoFileClip("test.mp4")

# Extract audio
print("🎵 Extracting audio from video...")
with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
    audio_path = temp_audio.name
    video.audio.write_audiofile(audio_path)

# Transcribe audio
print("🔊 Transcribing audio with Whisper...")
model = whisper.load_model("base")
result = model.transcribe(audio_path, word_timestamps=True)
os.unlink(audio_path)
print("✅ Transcription completed!")

# Process text chunks
word_segments = result["segments"]
word_chunks = []
for seg in word_segments:
    words = seg["words"]
    for i in range(0, len(words), 3):
        chunk = words[i:i+3]
        text = " ".join([w["word"] for w in chunk])
        start = chunk[0]["start"]
        end = chunk[-1]["end"]
        word_chunks.append((text, start, end))

print(f"📋 Found {len(word_chunks)} text chunks in video")

# Initialize b-roll counter
broll_count = 0
clips = [video]
temp_files = []

print(f"🎞️ Starting overlay processing (Max {MAX_BROLLS} b-rolls)...")

for idx, (text, start, end) in enumerate(word_chunks, 1):
    # Create text clip
    txt_clip = (TextClip(text.strip(), fontsize=50, color='white',
                font="Arial-Bold", stroke_color='black', stroke_width=2)
                .set_position(("center", "bottom"))
                .set_start(start)
                .set_duration(end - start))
    clips.append(txt_clip)
    
    # Add b-roll if under limit
    if broll_count < MAX_BROLLS:
        try:
            print(f"\n📦 Processing chunk {idx}/{len(word_chunks)}")
            print(f"🔍 Searching Pexels for: '{text}'...")
            
            response = requests.get(
                "https://api.pexels.com/v1/search",
                headers={"Authorization": API_KEY},
                params={"query": text, "per_page": 1, "orientation": "landscape"}
            )
            response.raise_for_status()
            
            data = response.json()
            if data.get('photos'):
                image_url = data['photos'][0]['src']['original']
                print(f"🌄 Found image: {image_url}")
                
                img_response = requests.get(image_url)
                img_response.raise_for_status()
                
                with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f:
                    f.write(img_response.content)
                    temp_img_path = f.name
                    temp_files.append(temp_img_path)
                
                img_clip = (ImageClip(temp_img_path)
                            .resize(width=video.w//2)
                            .set_position(("center", "top"))
                            .set_start(start)
                            .set_duration(end - start))
                
                clips.append(img_clip)
                broll_count += 1
                print(f"✅ Added b-roll {broll_count}/{MAX_BROLLS}")
            else:
                print("⚠️ No images found for this chunk")
                
        except Exception as e:
            print(f"❌ Error processing b-roll: {str(e)}")
    else:
        print(f"⏹️ B-roll limit reached ({MAX_BROLLS}), skipping image overlay")

# Compose final video
print("\n🎬 Rendering final video...")
final = CompositeVideoClip(clips)
final.write_videofile("captioned.mp4", codec="libx264", fps=video.fps)

# Cleanup
print("🧹 Cleaning up temporary files...")
for file_path in temp_files:
    try:
        os.unlink(file_path)
    except Exception as e:
        print(f"⚠️ Error deleting {file_path}: {e}")

print("\n✨ Processing complete! Final video saved as 'captioned.mp4'")
print(f"🎉 Total b-rolls added: {broll_count}/{MAX_BROLLS}")