FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for FFmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    libgl1-mesa-glx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the scripts directory first (includes search_terms.json)
COPY scripts/ ./scripts/

# Create an API server for the video processing service
COPY api_server.py .

# Create the necessary directories
RUN mkdir -p /tmp/uploads

# Expose the port the API will run on
EXPOSE 8000

# Run the API server with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--timeout", "300", "api_server:app"] 