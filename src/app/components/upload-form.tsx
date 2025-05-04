"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Download,
  Captions,
  Upload,
  Film,
  FileVideo,
  Play,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ProcessedVideo {
  videoUrl: string;
  captions: string;
}

export function ExampleShowcase() {
  return (
    <Card className="p-8 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border-0 shadow-xl rounded-2xl overflow-hidden backdrop-blur mt-10">
      <div className="flex items-center mb-6">
        <Play className="h-7 w-7 text-purple-600 mr-3" />
        <h2 className="text-xl font-bold text-slate-800">See the Difference</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Video */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-700">Original Video</h3>
          <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
            <video src="/pitch.mp4" controls className="w-full h-full" />
          </div>
          <p className="text-sm text-slate-600">Your raw, unprocessed video</p>
        </div>

        {/* Captioned Video */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-700">
            Professional Result
          </h3>
          <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
            <video
              src="/pitch_captioned.mp4"
              controls
              className="w-full h-full"
            />
          </div>
          <p className="text-sm text-slate-600">
            With captions and B-roll overlays
          </p>
        </div>
      </div>
    </Card>
  );
}

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [processedVideo, setProcessedVideo] = useState<ProcessedVideo | null>(
    null
  );
  const [selectedBroll, setSelectedBroll] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate progress during upload/processing
  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 1;
      if (currentProgress > 95) {
        clearInterval(interval);
        setProgress(95);
      } else {
        setProgress(currentProgress);
      }
    }, 800);
    return interval;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      setStatus("");
      setProcessedVideo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    // Start progress simulation
    const progressInterval = simulateProgress();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("broll", selectedBroll);

    try {
      setStatus("Uploading and processing your video...");
      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("Processing complete!");
        setProcessedVideo({
          videoUrl: data.videoUrl,
          captions: data.captions || "",
        });
      } else {
        setStatus(`Error: ${data.error || "Failed to process video"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to process video");
      clearInterval(progressInterval);
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Upload Form Card */}
      <Card className="p-8 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border-0 shadow-xl rounded-2xl overflow-hidden backdrop-blur">
        <div className="flex items-center mb-8">
          <Film className="h-9 w-9 text-purple-600 mr-4" />
          <h2 className="text-2xl font-bold text-slate-800">
            Create Professional Video
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Area */}
          <div
            className="border-3 border-dashed border-slate-300 rounded-xl p-8 text-center bg-white/60 backdrop-blur-sm hover:border-purple-500 transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {!videoPreview ? (
              <>
                <FileVideo className="h-16 w-16 mx-auto text-slate-400 mb-4 group-hover:text-purple-500 transition-colors" />
                <p className="text-slate-700 font-semibold text-lg">
                  Drop your video here or click to browse
                </p>
                <p className="text-slate-500 mt-2">
                  MP4, MOV, or AVI files (max 100MB)
                </p>
              </>
            ) : (
              <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
                <video
                  ref={videoRef}
                  src={videoPreview}
                  controls
                  className="w-full h-full"
                />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* File Info */}
          {file && (
            <div className="bg-white rounded-lg p-4 flex items-center shadow-sm border border-slate-200">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <FileVideo className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-red-500"
                onClick={() => {
                  setFile(null);
                  setVideoPreview("");
                }}
              >
                Remove
              </Button>
            </div>
          )}

          {/* B-roll Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 block">
              B-roll Style
            </label>
            <select
              value={selectedBroll}
              onChange={(e) => setSelectedBroll(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70 backdrop-blur-sm transition-all text-slate-800"
              disabled={isUploading}
            >
              <option value="">No B-roll</option>
              <option value="nature">Nature & Landscapes</option>
              <option value="city">Urban & City</option>
              <option value="people">People & Lifestyle</option>
              <option value="office">Business & Work</option>
              <option value="technology">Technology</option>
              <option value="food">Food & Cuisine</option>
              <option value="abstract">Abstract Concepts</option>
            </select>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 font-medium flex items-center">
                  {progress < 100 ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      Complete
                    </>
                  )}
                </span>
                <span className="text-slate-600 font-medium">{progress}%</span>
              </div>
              <Progress
                value={progress}
                className={`h-3 bg-slate-200 ${
                  progress === 100 ? "text-green-600" : ""
                }`}
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!file || isUploading}
            className="w-full py-7 text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg rounded-xl transition-all"
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Video...
              </div>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Create Professional Video
              </>
            )}
          </Button>

          {/* Status Message */}
          {status && (
            <div
              className={`text-sm font-medium px-5 py-4 rounded-lg ${
                status.includes("Error")
                  ? "bg-red-100 text-red-800 border border-red-200 flex items-center"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center"
              }`}
            >
              {status.includes("Error") ? (
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
              )}
              {status}
            </div>
          )}
        </form>
      </Card>

      {/* Processed Video Card */}
      {processedVideo && (
        <Card className="overflow-hidden bg-white shadow-xl border-0 rounded-2xl">
          <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <Play className="h-5 w-5 text-purple-600 mr-2" />
                Your Professional Video
              </h3>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center text-slate-700 hover:text-purple-700 border-slate-300 hover:border-purple-300 rounded-lg"
                  onClick={() => window.open(processedVideo.videoUrl, "_blank")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                {processedVideo.captions && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center text-slate-700 hover:text-purple-700 border-slate-300 hover:border-purple-300 rounded-lg"
                  >
                    <Captions className="w-4 h-4 mr-2" />
                    View Captions
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="aspect-video bg-black">
            <video
              src={processedVideo.videoUrl}
              controls
              className="w-full h-full"
            />
          </div>

          {processedVideo.captions && (
            <div className="p-6 bg-slate-50">
              <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                <Captions className="h-4 w-4 text-purple-600 mr-2" />
                Generated Captions
              </h4>
              <div className="bg-white p-5 rounded-lg border border-slate-200 max-h-64 overflow-y-auto shadow-sm">
                <p className="text-sm whitespace-pre-line text-slate-600 leading-relaxed">
                  {processedVideo.captions}
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Example Showcase */}
      <ExampleShowcase />
    </div>
  );
}
