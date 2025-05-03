import os
import sys
import tempfile
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
import uuid
import requests
import json
from dotenv import load_dotenv
import importlib.util

# Add scripts directory to path
sys.path.append('./scripts')

# Import the video processing function from the renamed file (with underscore)
from scripts.process_video import process_video

# Load environment variables (continue even if .env file doesn't exist)
try:
    load_dotenv()
    print("Loaded environment variables from .env file")
except Exception as e:
    print(f"Note: Could not load .env file: {e}. Using system environment variables.")

app = Flask(__name__)

# Configure upload settings
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv', 'webm'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max upload

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'ok',
        'environment': {
            'API_KEY_SET': bool(os.environ.get('PEXELS_API_KEY')),
            'MAX_BROLLS': os.environ.get('MAX_BROLLS', '5'),
            'WHISPER_MODEL': os.environ.get('WHISPER_MODEL', 'base')
        }
    }), 200

@app.route('/process', methods=['POST'])
def process_video_endpoint():
    """Process a video file and return the processed video"""
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    # Check if file is valid
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': f'File type not allowed. Supported types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
    
    try:
        # Create random ID for temp files
        temp_id = str(uuid.uuid4())
        
        # Save the uploaded file
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{temp_id}-input.mp4")
        file.save(input_path)
        
        # Define output path
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{temp_id}-output.mp4")
        
        # Process the video
        process_video(input_path, output_path)
        
        # Return the processed video file
        return send_file(
            output_path,
            mimetype='video/mp4',
            as_attachment=True,
            download_name=f"processed-{secure_filename(file.filename)}"
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Clean up temp files
        for path in [input_path, output_path]:
            try:
                if os.path.exists(path):
                    os.remove(path)
            except Exception as e:
                print(f"Failed to remove temp file {path}: {e}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port) 