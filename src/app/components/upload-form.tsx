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
} from "lucide-react";

interface ProcessedVideo {
  videoUrl: string;
  captions: string;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("broll", selectedBroll);

    try {
      setStatus("Uploading...");
      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

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
    } finally {
      setProgress(0);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Form Card */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
        <div className="flex items-center mb-6">
          <Film className="h-8 w-8 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold text-slate-800">
            Create Reel-Style Video
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-white/50 backdrop-blur-sm hover:border-purple-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {!videoPreview ? (
              <>
                <FileVideo className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                <p className="text-slate-600 font-medium">
                  Drop your video here or click to browse
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  MP4, MOV, or AVI files
                </p>
              </>
            ) : (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
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

          {/* B-roll Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              B-roll Style
            </label>
            <select
              value={selectedBroll}
              onChange={(e) => setSelectedBroll(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70 backdrop-blur-sm transition-all"
              disabled={isUploading}
            >
              <option value="">No B-roll</option>
              <option value="nature">Nature & Landscapes</option>
              <option value="city">Urban & City</option>
              <option value="people">People & Lifestyle</option>
              <option value="office">Business & Work</option>
              <option value="technology">Technology</option>
              <option value="food">Food & Cuisine</option>
            </select>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Processing...</span>
                <span className="text-slate-600 font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-slate-200" />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!file || isUploading}
            className="w-full py-6 text-base font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md"
          >
            {isUploading ? (
              <div className="flex items-center">
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
                Process Video
              </>
            )}
          </Button>

          {/* Status Message */}
          {status && (
            <div
              className={`text-sm font-medium px-4 py-3 rounded-lg ${
                status.includes("Error")
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {status}
            </div>
          )}
        </form>
      </Card>

      {/* Processed Video Card */}
      {processedVideo && (
        <Card className="overflow-hidden bg-white shadow-xl border-0">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <Play className="h-5 w-5 text-purple-600 mr-2" />
                Processed Video
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center text-slate-700 hover:text-purple-700 border-slate-300 hover:border-purple-300"
                  onClick={() => window.open(processedVideo.videoUrl, "_blank")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                {processedVideo.captions && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center text-slate-700 hover:text-purple-700 border-slate-300 hover:border-purple-300"
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
              <h4 className="font-medium text-slate-800 mb-3">
                Generated Captions
              </h4>
              <div className="bg-white p-4 rounded-lg border border-slate-200 max-h-64 overflow-y-auto">
                <p className="text-sm whitespace-pre-line text-slate-600">
                  {processedVideo.captions}
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
