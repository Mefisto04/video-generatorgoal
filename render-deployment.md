# Deploying the Video Processor to Render

Follow these steps to deploy the video processing service to Render.com:

## Prerequisites

1. Create a [Render.com](https://render.com) account
2. Have your Pexels API key ready

## Deployment Steps

### 1. Create a New Web Service

1. Log in to your Render dashboard
2. Click the "New +" button and select "Web Service"
3. Connect your GitHub repository (or use the public repo URL)

### 2. Configure the Web Service

Use these settings:

- **Name**: `video-processor` (or your preferred name)
- **Environment**: Docker
- **Branch**: main (or your deployment branch)
- **Region**: Choose the closest to your users
- **Plan**: Standard (or higher - video processing requires good resources)

### 3. Add Environment Variables

Add these environment variables:

- `PEXELS_API_KEY`: Your Pexels API key
- `MAX_BROLLS`: 5 (or your preferred number)
- `WHISPER_MODEL`: base (or tiny, small, medium, large depending on your needs)

### 4. Advanced Settings

Adjust these settings:

- **Health Check Path**: /health
- **Auto-Deploy**: Yes (optional)
- **Persistent Disk**: Add at least 1GB for temporary file storage
- **Start Command**: Leave empty (Dockerfile uses CMD to run gunicorn)

> Note: If you need to override the start command, you can use:
>
> ```
> gunicorn --bind 0.0.0.0:8000 api_server:app
> ```

### 5. Deploy

Click "Create Web Service" and wait for the deployment to complete.

## Troubleshooting

If your deployment fails, check the build logs for specific errors:

1. **Environment Variable Issues**: Make sure all required environment variables are set in the Render dashboard
2. **Memory/Resource Issues**: Video processing requires significant resources, consider upgrading your plan
3. **Build Failures**: Ensure all dependencies are correctly specified in requirements.txt

## Testing the Deployed Service

Once deployed, you can test the API using curl:

```bash
# Test the health endpoint
curl https://your-render-service-url.onrender.com/health

# Process a video
curl -X POST https://your-render-service-url.onrender.com/process \
  -F "file=@/path/to/your/video.mp4" \
  -o processed-video.mp4
```

## Service URL

After successful deployment, Render will provide a URL like:
`https://video-processor-xxxx.onrender.com`

Copy this URL and set it as the `VIDEO_PROCESSOR_URL` environment variable in your Next.js application's Vercel deployment.
