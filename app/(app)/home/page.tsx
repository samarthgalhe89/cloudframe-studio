"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/app/generated/prisma/client";
import { toast } from "react-hot-toast";

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos
  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos?publicOnly=true");

      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // ⭐ FIXED: Cloudinary-safe download using Blob
  const handleDownload = useCallback(async (url: string, title: string) => {
    try {
      const response = await fetch(url);

      // convert the response to a Blob
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // create a hidden <a> link and trigger click
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title}.mp4`;
      document.body.appendChild(link);
      link.click();

      // cleanup
      URL.revokeObjectURL(blobUrl);
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  }, []);

  const handleDelete = async (id: string, publicId: string) => {
  try {
    await axios.post("/api/video-delete", { id, publicId });
    toast.success("Video deleted successfully!");

    setVideos((prev) => prev.filter((v) => v.id !== id));
  } catch (error) {
    toast.error("Failed to delete video.");
  }
};


  if (loading) {
    return <div className="text-center p-10 text-[#6B5335]">Loading...</div>;
  }

  return (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4 text-[#6B5335]">Videos</h1>

    {videos.length === 0 ? (
      <div className="text-center text-lg text-[#8B6F47]">
        No videos available
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        ))}
      </div>
    )}
  </div>
);
}

export default Home;
