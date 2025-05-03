import { UploadForm } from "./components/upload-form";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Video Processing Platform</h1>
          <p className="text-muted-foreground">
            Upload your video and get it processed with automatic captions and
            B-roll integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Upload Video</h2>
            <UploadForm />
          </div>
        </div>
      </div>
    </main>
  );
}
