import { UploadForm } from "./components/upload-form";
import {
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30">
      {/* Header/Hero Section */}
      <header className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Create Professional Videos{" "}
              <span className="text-purple-200">Automatically</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Transform your content with AI-powered captions and B-roll
              integration. Upload any video and get a professionally enhanced
              version in minutes.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6">

        {/* Upload Section */}
        <section id="upload-section" className="scroll-mt-16">
          <div className="text-center mb-12">
            <div className="inline-block p-2 px-4 bg-purple-100 rounded-full text-purple-800 font-medium text-sm mb-4">
              Start Creating Now
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Upload Your Video
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Transform your content with our AI video processing platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-8">
              <UploadForm />
            </div>

            <div className="lg:col-span-4 bg-white p-8 rounded-2xl shadow-lg border border-slate-200/50 space-y-6 sticky top-10">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                Pro Tips
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-indigo-800 mb-2">
                    Video Quality
                  </h4>
                  <p className="text-indigo-700 text-sm">
                    For best results, use videos with clear audio and at least
                    720p resolution.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">
                    Speech Clarity
                  </h4>
                  <p className="text-purple-700 text-sm">
                    Clear, well-paced speech leads to more accurate captions and
                    better B-roll selection.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">
                    B-roll Selection
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Different B-roll styles work better for different content
                    types. Experiment to find the best match.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-white text-xl font-bold mb-2">AI Video Maker</h3>
              <p className="text-slate-400 text-sm">
                AI-powered video enhancement platform
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                Developed as part of the Inagiffy &lt;&gt; Fueler Task
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
