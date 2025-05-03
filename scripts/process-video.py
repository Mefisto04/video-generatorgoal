import sys
import whisper
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, ImageClip
import tempfile
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MAX_BROLLS = int(os.getenv('MAX_BROLLS', 5))  # Increased for demonstration
API_KEY = os.getenv('PEXELS_API_KEY')
WHISPER_MODEL = os.getenv('WHISPER_MODEL', 'base')

# Load search terms
def load_search_terms():
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        with open(os.path.join(script_dir, 'search_terms.json'), 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: Could not load search terms JSON: {e}")
        return {}

SEARCH_TERMS = load_search_terms()

def find_search_term(text):
    """Find a good search term for a given text"""
    # Normalize the text
    text = text.lower().strip()
    words = text.split()
    
    # Look through all categories
    for category, terms in SEARCH_TERMS.items():
        for key, value in terms.items():
            if key.lower() in text:
                return value
    
    # If no match found, return the original text (fallback)
    return text

def process_video(input_path, output_path):
    print("🚀 Starting video processing pipeline...")
    
    try:
        # Load video
        print(f"📹 Loading video file: {input_path}")
        video = VideoFileClip(input_path)

        # Extract audio
        print("🎵 Extracting audio from video...")
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
            audio_path = temp_audio.name
            video.audio.write_audiofile(audio_path)

        # Transcribe audio
        print(f"🔊 Transcribing audio with Whisper ({WHISPER_MODEL} model)...")
        model = whisper.load_model(WHISPER_MODEL)
        result = model.transcribe(audio_path, word_timestamps=True)
        os.unlink(audio_path)
        print("✅ Transcription completed!")

        # Group words into chunks for lip-synced captions (3 words per chunk)
        caption_chunks = []
        for seg in result["segments"]:
            words = seg.get("words", [])
            i = 0
            while i < len(words):
                chunk = words[i:i+3]  # 3 words per chunk
                if not chunk:
                    break
                text = " ".join([w["word"] for w in chunk])
                start = chunk[0]["start"]
                end = chunk[-1]["end"]
                caption_chunks.append((text, start, end))
                i += 3

        print(f"📋 Found {len(caption_chunks)} caption chunks in video")

        # Initialize b-roll counter
        broll_count = 0
        clips = [video]
        temp_files = []

        print(f"🎞️ Starting overlay processing (Max {MAX_BROLLS} b-rolls)...")

        # Add captions for the whole video
        for text, start, end in caption_chunks:
            txt_clip = (TextClip(text.strip(), fontsize=50, color='white',
                        font="Arial-Bold", stroke_color='black', stroke_width=2)
                        .set_position(("center", "bottom"))
                        .set_start(start)
                        .set_duration(end - start))
            clips.append(txt_clip)

        # Select a few chunks for b-rolls (every 5th chunk)
        broll_chunks = caption_chunks[::5]
        
        for idx, (text, start, end) in enumerate(broll_chunks, 1):
            # Add b-roll if under limit
            if broll_count < MAX_BROLLS:
                try:
                    print(f"\n📦 Processing caption chunk {idx}/{len(broll_chunks)}")
                    print(f"🔍 Searching Pexels for: '{text}'...")
                    
                    # Find appropriate search term
                    search_term = find_search_term(text)
                    print(f"🔎 Using search term: '{search_term}'")
                    
                    response = requests.get(
                        "https://api.pexels.com/v1/search",
                        headers={"Authorization": API_KEY},
                        params={
                            "query": search_term,
                            "per_page": 1,
                            "orientation": "landscape"
                        }
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
        final.write_videofile(output_path, codec="libx264", fps=video.fps)

        # Cleanup
        print("🧹 Cleaning up temporary files...")
        for file_path in temp_files:
            try:
                os.unlink(file_path)
            except Exception as e:
                print(f"⚠️ Error deleting {file_path}: {e}")

        print("\n✨ Processing complete!")
        print(f"🎉 Total b-rolls added: {broll_count}/{MAX_BROLLS}")
        
        return output_path
        
    except Exception as e:
        print(f"🔥 Critical error during processing: {str(e)}")
        raise

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python process-video.py <input_path> <output_path>")
        sys.exit(1)
        
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    process_video(input_path, output_path)