"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast';

function VideoUpload() {

  const [file, setFile] = useState<File | null> (null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  
  const router = useRouter()

  // max file size of 60MB
  const MAX_FILE_SIZE = 60 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    if(file.size > MAX_FILE_SIZE){
      
      toast.error("File size exceeds the maximum limit of 60MB.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append("originalSize", file.size.toString());

    try {
      await axios.post("/api/video-upload", formData)

      //check for 200 response
      toast.success("Video uploaded successfully!");
      router.refresh();

    } catch (error) {
      console.log(error);
      toast.error("Video upload failed. Please try again.");
    }
    finally{
      setIsUploading(false);
    }

  }


  return (
  <div className="min-h-screen w-full bg-[#F5F1E8] flex justify-center px-4 py-10">
    <div className="w-full max-w-3xl">
      
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10 text-[#6B5335]">
        Video Upload
      </h1>

      <div className="space-y-10">

        {/* Upload File Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-[#6B5335]">Upload Video</h2>

          <label className="block text-[#8B6F47] mb-2">Choose a video file</label>

          <div className="flex items-center gap-3">
            <label className="
              bg-[#A88B5F] hover:bg-[#8B6F47]
              text-white px-5 py-3 rounded-lg cursor-pointer
              transition font-semibold shadow-md
            ">
              CHOOSE FILE
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                required
              />
            </label>

            <span className="text-[#8B6F47] text-sm">
              {file ? file.name : "No file chosen"}
            </span>
          </div>
        </div>

        {/* Title Input */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[#6B5335]">Video Title</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="
              w-full bg-white border-2 border-[#E8DCC8]
              focus:border-[#A88B5F] focus:ring-2 focus:ring-[#A88B5F]/20
              rounded-lg px-4 py-3 outline-none text-[#6B5335]
              placeholder:text-[#B8A58A]
              transition shadow-sm
            "
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[#6B5335]">Description</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description..."
            className="
              w-full h-32 bg-white border-2 border-[#E8DCC8]
              focus:border-[#A88B5F] focus:ring-2 focus:ring-[#A88B5F]/20
              rounded-lg px-4 py-3 outline-none text-[#6B5335]
              placeholder:text-[#B8A58A]
              transition resize-none shadow-sm
            "
          />
        </div>

        {/* Preview-like Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[#6B5335]">Preview:</h2>
          <div className="w-full h-64 bg-white border-2 border-[#E8DCC8] rounded-xl flex items-center justify-center text-[#B8A58A] shadow-sm">
            No preview available
          </div>
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isUploading}
          className="
            w-full bg-[#A88B5F] hover:bg-[#8B6F47]
            text-white py-4 rounded-xl font-semibold text-lg
            transition disabled:opacity-50 shadow-lg
          "
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>

      </div>
    </div>
  </div>
);


}

export default VideoUpload