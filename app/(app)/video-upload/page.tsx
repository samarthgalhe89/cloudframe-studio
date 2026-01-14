"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const router = useRouter();
  const MAX_FILE_SIZE = 60 * 1024 * 1024;

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // cleanup
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return toast.error("Please choose a video file.");
    if (!title.trim()) return toast.error("Please add a title.");
    if (file.size > MAX_FILE_SIZE)
      return toast.error("File size exceeds 60MB.");

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // 1) Get Cloudinary signature
      const sigRes = await axios.post("/api/cloudinary-signature");
      const uploadConfig = sigRes.data;

      // 2) Upload to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${uploadConfig.cloudName}/video/upload`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", uploadConfig.apiKey);
      formData.append("timestamp", String(uploadConfig.timestamp));
      formData.append("signature", uploadConfig.signature);
      formData.append("folder", uploadConfig.folder);
      formData.append("resource_type", "video");
      formData.append("eager", uploadConfig.eager); // Use the signed eager value

      const cloudinaryResponse = await axios.post(cloudinaryUrl, formData, {
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
        },
      });

      const cloudinaryData = cloudinaryResponse.data;

      // Get compressed size from eager transformation result
      let compressedSize = cloudinaryData.bytes; // fallback to original

      if (cloudinaryData.eager && cloudinaryData.eager.length > 0) {
        // Use the size of the first eager transformation (the compressed version)
        compressedSize = cloudinaryData.eager[0].bytes;
      }

      console.log("Compression Results:", {
        original: file.size,
        uploaded: cloudinaryData.bytes,
        compressed: compressedSize,
        savings: ((file.size - compressedSize) / file.size * 100).toFixed(2) + "%"
      });

      // 3) Save metadata in DB
      await axios.post("/api/video-save", {
        title,
        description,
        publicId: cloudinaryData.public_id,
        originalSize: file.size,
        compressedSize: compressedSize,
        duration: cloudinaryData.duration || 0,
      });

      toast.success("Video uploaded successfully!");
      setUploadProgress(100);

      setFile(null);
      setTitle("");
      setDescription("");

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Video upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFBF5] flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl">

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="p-4 bg-white rounded-xl border border-[#FED7AA] text-center">
            <div className="text-2xl mb-2">🗜️</div>
            <div className="text-sm font-medium text-[#1C1917]">Auto Compression</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#FED7AA] text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm font-medium text-[#1C1917]">Fast Processing</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Upload File */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-[#1C1917]">
              Upload Video
            </h2>

            <label className="block text-[#1C1917]/70 mb-2">Choose a video file</label>

            <div className="flex items-center gap-3">
              <label
                className="
                  bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#FB923C] hover:to-[#F472B6]
                  text-[#1C1917] px-5 py-3 rounded-lg cursor-pointer
                  transition-all duration-200 font-semibold shadow-lg shadow-[#6366F1]/30
                "
              >
                CHOOSE FILE
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              <span className="text-[#1C1917]/70 text-sm">
                {file ? file.name : "No file chosen"}
              </span>
            </div>

            {/* Progress bar */}
            {isUploading && (
              <div className="w-full bg-[#1E293B] rounded-lg h-3 mt-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#818CF8] transition-all shadow-lg shadow-[#6366F1]/50"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#1C1917]">
              Video Title
            </h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="
                w-full bg-white border-2 border-[#FED7AA]
                focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20
                rounded-lg px-4 py-3 outline-none text-[#1C1917]
                placeholder:text-[#1C1917]/70
                transition shadow-sm
              "
              required
            />
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#1C1917]">
              Description
            </h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              className="
                w-full h-32 bg-white border-2 border-[#FED7AA]
                focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20
                rounded-lg px-4 py-3 outline-none text-[#1C1917]
                placeholder:text-[#1C1917]/50
                transition resize-none shadow-sm
              "
            />
          </div>

          {/* Preview placeholder */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#1C1917]">
              Preview:
            </h2>
            {previewUrl ? (
              <div className="w-full h-64 bg-white border-2 border-[#FED7AA] rounded-xl overflow-hidden shadow-sm relative">
                <video
                  src={previewUrl}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-white border-2 border-[#FED7AA] rounded-xl flex items-center justify-center text-[#1C1917]/50 shadow-sm">
                No preview available
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="
              w-full bg-gradient-to-r from-[#F97316] to-[#EC4899]
              hover:from-[#FB923C] hover:to-[#F472B6]
              text-[#1C1917] py-4 rounded-xl font-semibold text-lg
              transition disabled:opacity-50 shadow-lg shadow-orange-500/20
            "
          >
            {isUploading
              ? `Uploading... ${uploadProgress}%`
              : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;
