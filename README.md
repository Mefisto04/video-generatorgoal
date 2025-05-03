# AI Video GeneratorGoal

![Captacity](https://img.shields.io/badge/Captacity-Video%20Platform-8A2BE2)
![Next.js](https://img.shields.io/badge/Next.js-14+-000000)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB)

A professional video processing platform that automatically enhances videos with captions and B-roll footage. This project was developed as an internship task for Inagiffy <> Fueler.

## ✨ Features

- **Video Upload & Processing**: Upload videos and get them automatically enhanced
- **Automatic Captions**: Transcribe speech in videos using Whisper AI
- **B-roll Integration**: Automatically overlay relevant images based on speech content
- **Responsive UI**: Beautiful and professional user interface
- **Download Processed Videos**: Easy download of enhanced videos

## 📁 Project Structure

```
captacity/
├── src/                # Source code
│   ├── app/            # Next.js application
│   │   ├── api/        # API routes
│   │   │   └── process/# Video processing endpoint
│   │   ├── components/ # React components
│   │   └── page.tsx    # Main landing page
│   └── components/     # UI components (shadcn)
├── scripts/            # Python processing scripts
│   ├── process-video.py# Main video processing script
│   └── search_terms.json# Keywords for B-roll content
├── public/             # Static assets
├── .env                # Environment variables
└── package.json        # Dependencies
```

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Video Processing**: Python, MoviePy, Whisper AI
- **Image Search**: Pexels API
- **Deployment**: Vercel (frontend), Python scripts (backend)

## 🖥 Frontend Architecture

The frontend is built with Next.js and structured with a clean component-based architecture:

### Key Components

- **`page.tsx`**: Main landing page with layout and information
- **`upload-form.tsx`**: Handles video upload, processing status, and displaying results
- **UI Components**: Using shadcn/ui for consistent design (Button, Card, Progress)

## 🔄 Backend Architecture

The backend consists of Next.js API routes that handle:

1. **File Upload**: Receiving video files from the frontend
2. **Processing Pipeline**: Coordinating Python scripts for video enhancement
3. **Response Handling**: Returning processed video URLs and captions

### API Endpoints

- **POST `/api/process`**: Accepts video files and B-roll style preferences, processes the video, and returns URLs to the processed video and extracted captions.

## 📜 Scripts

The core processing happens in Python scripts:

### `process-video.py`

This is the main script that:

1. **Transcribes Video**: Uses Whisper AI to extract speech and timestamps
2. **Creates Captions**: Formats captions with proper styling and positioning
3. **Fetches B-roll**: Searches Pexels API for relevant images based on speech content
4. **Composes Final Video**: Overlays captions and B-roll onto the original video

## 🗄 Database

The current version uses file-based storage instead of a traditional database:

- Processed videos are stored in temporary storage
- Metadata about videos is not persisted between sessions

## 🎬 Usage

1. Open the application in your browser
2. Upload a video file from your device
3. Select a B-roll style from the dropdown
4. Click "Process Video" and wait for processing to complete
5. View the processed video with captions and B-roll
6. Download the enhanced video or view the generated captions

## 🎥 Demo

[View Demo Video](https://drive.google.com/file/d/1vBdg344SFsnSek7Y6zgngw4ueINJ8YcG/view?usp=sharing)

---

Developed as part of the Inagiffy <> Fueler Task.
