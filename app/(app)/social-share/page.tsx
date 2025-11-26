"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] =
    useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setUploadImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Image upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_")}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
  };

  return (
  <div className="min-h-screen w-full bg-[#F5F1E8] flex justify-center px-4 py-10">
    <div className="w-full max-w-3xl">

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-10 text-[#6B5335]">
        Social Media Image Creator
      </h1>

      {/* Main Container */}
      <div className="space-y-10">

        {/* Upload Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-[#6B5335]">Upload an Image</h2>

          <label className="block text-[#8B6F47] mb-2">
            Choose an image file
          </label>

          <div className="flex items-center gap-3">
            <label
              className="
                bg-[#A88B5F] hover:bg-[#8B6F47]
                text-white px-5 py-3 rounded-lg cursor-pointer
                transition font-semibold shadow-md
              "
            >
              CHOOSE FILE
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            <span className="text-[#8B6F47] text-sm">
              {uploadedImage ? uploadedImage.split('/').pop() : "No file chosen"}
            </span>
          </div>

          {isUploading && (
            <div className="w-full bg-[#E8DCC8] rounded-lg h-3 mt-4 overflow-hidden">
              <div className="h-full bg-[#A88B5F] animate-pulse"></div>
            </div>
          )}
        </div>

        {/* After Upload */}
        {uploadedImage && (
          <>
            {/* Format Select */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-[#6B5335]">
                Select Social Media Format
              </h2>

              <select
                className="
                  w-full bg-white border-2 border-[#E8DCC8]
                  focus:border-[#A88B5F] focus:ring-2 focus:ring-[#A88B5F]/20
                  rounded-lg px-4 py-3 outline-none text-[#6B5335]
                  transition shadow-sm
                "
                value={selectedFormat}
                onChange={(e) =>
                  setSelectedFormat(e.target.value as SocialFormat)
                }
              >
                {Object.keys(socialFormats).map((format) => (
                  <option
                    key={format}
                    value={format}
                    className="bg-white text-[#6B5335]"
                  >
                    {format}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-[#6B5335]">Preview:</h3>

              <div className="relative flex justify-center bg-white border-2 border-[#E8DCC8] p-4 rounded-xl shadow-sm">

                {isTransforming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                    <div className="w-10 h-10 border-4 border-[#E8DCC8] border-t-[#A88B5F] rounded-full animate-spin"></div>
                  </div>
                )}

                <CldImage
                  ref={imageRef}
                  width={socialFormats[selectedFormat].width}
                  height={socialFormats[selectedFormat].height}
                  src={uploadedImage}
                  sizes="100vw"
                  crop="fill"
                  gravity="auto"
                  alt="transformed"
                  aspectRatio={socialFormats[selectedFormat].aspectRatio}
                  onLoad={() => setIsTransforming(false)}
                />
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleDownload}
                className="
                  bg-[#A88B5F] hover:bg-[#8B6F47]
                  text-white px-6 py-3 rounded-xl
                  font-semibold transition shadow-lg
                "
              >
                Download for {selectedFormat}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  </div>
);

}
