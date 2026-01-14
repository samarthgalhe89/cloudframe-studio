"use client";

import React, { useState } from "react";
import axios from "axios";
import { FileUp, Download, Check, Loader2, AlertCircle, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

type AspectRatio = "9:16" | "1:1" | "16:9" | "4:5";

interface CropFormat {
    label: string;
    aspectRatio: AspectRatio;
    width: number;
    height: number;
    description: string;
}

const formats: CropFormat[] = [
    {
        label: "Instagram Reel",
        aspectRatio: "9:16",
        width: 1080,
        height: 1920,
        description: "Full screen vertical video"
    },
    {
        label: "Square Post",
        aspectRatio: "1:1",
        width: 1080,
        height: 1080,
        description: "Perfect for Instagram feed"
    },
    {
        label: "Portrait",
        aspectRatio: "4:5",
        width: 1080,
        height: 1350,
        description: "Taller feed posts"
    },
    {
        label: "Landscape",
        aspectRatio: "16:9",
        width: 1920,
        height: 1080,
        description: "Standard YouTube format"
    }
];

export default function VideoCropPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [publicId, setPublicId] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<CropFormat>(formats[0]);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);

    // Initial video upload
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
            toast.error("File size too large (Max 100MB)");
            return;
        }

        setFile(selectedFile);
        setUploading(true);
        setUploadProgress(0);
        setPublicId(null);
        setProcessedUrl(null);
        setIsProcessing(false); // Valid for upload phase

        try {
            // 1. Get signature
            const sigRes = await axios.post("/api/cloudinary-signature");
            const { signature, timestamp, apiKey, cloudName, folder, eager } = sigRes.data;

            // 2. Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("api_key", apiKey);
            formData.append("timestamp", timestamp.toString());
            formData.append("signature", signature);
            formData.append("folder", folder);
            formData.append("eager", eager); // Include eager to match signature
            formData.append("resource_type", "video");

            const uploadRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            // Scale upload progress to 0-90%
                            setUploadProgress(Math.round(percent * 0.9));
                        }
                    }
                }
            );

            setPublicId(uploadRes.data.public_id);
            // Don't set uploading(false) here, wait for polling
        } catch (error) {
            console.error(error);
            toast.error("Upload failed. Please try again.");
            setFile(null);
            setUploading(false); // Only stop on error
            setUploadProgress(0);
        }
        // Remove finally block to keep uploading=true on success
    };

    // Construct the transformation URL
    const getCroppedUrl = (pid: string, format: CropFormat) => {
        // Cloudinary transformation string
        // c_fill: Crop to fill dimensions
        // g_auto: AI Smart Gravity (focus on subject)
        // ar_: Aspect ratio
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        return `https://res.cloudinary.com/${cloudName}/video/upload/c_fill,g_auto,ar_${format.aspectRatio}/${pid}.mp4`;
    };

    // Handle format selection change
    // Handle format selection change
    // Handle format selection change
    React.useEffect(() => {
        let isMounted = true;
        if (publicId) {

            const url = getCroppedUrl(publicId, selectedFormat);

            // If already fully uploaded/processed, switch instantly
            if (!uploading) {
                console.log("Switching format instantly:", selectedFormat.label);
                setProcessedUrl(url);
                return;
            }

            // Otherwise, we are in the initial generic/upload phase
            setIsProcessing(true);
            setProcessedUrl(null);

            const checkVideoReady = async () => {
                if (!isMounted) return;
                try {
                    const res = await fetch(url, { method: 'HEAD' });
                    if (res.ok) {
                        setProcessedUrl(url);
                        setIsProcessing(false);
                        setUploading(false); // Done!
                        setUploadProgress(100);
                    } else {
                        // Slowly creep progress 90 -> 99
                        setUploadProgress(prev => Math.min(prev + 1, 99));
                        setTimeout(checkVideoReady, 2000);
                    }
                } catch (error) {
                    setTimeout(checkVideoReady, 2000);
                }
            };

            checkVideoReady();
        }
        return () => { isMounted = false; };
    }, [publicId, selectedFormat, uploading]);

    const handleDownload = async () => {
        if (!processedUrl) return;

        try {
            const response = await fetch(processedUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `cropped-video-${selectedFormat.aspectRatio.replace(":", "-")}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Download started!");
        } catch (e) {
            toast.error("Download failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF5] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Feature Badges */}
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                    <div className="px-4 py-2 bg-[#FED7AA] rounded-full text-sm text-[#1C1917] font-medium shadow-sm">
                        ✨ AI-Powered Cropping
                    </div>
                    <div className="px-4 py-2 bg-[#FED7AA] rounded-full text-sm text-[#1C1917] font-medium shadow-sm">
                        🎯 Smart Subject Detection
                    </div>
                    <div className="px-4 py-2 bg-[#FED7AA] rounded-full text-sm text-[#1C1917] font-medium shadow-sm">
                        ⚡ Instant Format Switch
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* LEFT COLUMN: Controls & Upload */}
                    <div className="space-y-8">
                        {/* Upload Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-2 border-[#FED7AA]">
                            <h2 className="text-xl font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-[#F97316]" />
                                1. Upload Video
                            </h2>

                            {!file ? (
                                <label className="block border-2 border-dashed border-[#FED7AA] rounded-2xl p-12 text-center cursor-pointer hover:border-[#F97316] hover:bg-[#FFFBF5] transition-all duration-300 group">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleUpload}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#F97316] to-[#EC4899] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <FileUp className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-base font-semibold text-[#1C1917] mb-1">
                                                Click to upload <span className="text-[#78716C]">or drag and drop</span>
                                            </p>
                                            <p className="text-sm text-[#78716C]">MP4, MOV, AVI up to 100MB</p>
                                        </div>
                                    </div>
                                </label>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-[#FFFBF5] rounded-xl border border-[#FED7AA]">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-gradient-to-r from-[#F97316] to-[#EC4899] rounded-lg">
                                            <FileUp className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-[#1C1917] truncate max-w-[200px]">
                                            {file.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setPublicId(null);
                                            setProcessedUrl(null);
                                            setUploadProgress(0);
                                            setIsProcessing(false);
                                            setUploading(false);
                                        }}
                                        className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            {uploading && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm text-[#78716C] mb-2">
                                        <span>Uploading...</span>
                                        <span className="font-semibold text-[#F97316]">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#FED7AA]/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#F97316] to-[#EC4899] transition-all duration-300 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Format Selection - Only show if file selected */}
                        <div className={`transition-all duration-300 ${!file && 'opacity-50 pointer-events-none grayscale'}`}>
                            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-[#FED7AA]">
                                <h2 className="text-xl font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-[#1C1917]" />
                                    2. Select Format
                                </h2>

                                <div className="grid grid-cols-2 gap-3">
                                    {formats.map((format) => (
                                        <button
                                            key={format.aspectRatio}
                                            onClick={() => setSelectedFormat(format)}
                                            className={`
                                                relative p-4 rounded-xl border-2 text-left transition-all duration-200
                                                ${selectedFormat.aspectRatio === format.aspectRatio
                                                    ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] border-transparent shadow-lg text-white'
                                                    : 'border-[#FED7AA] bg-white hover:border-[#F97316] text-[#1C1917]'}
                                            `}
                                        >
                                            <div className={`font-semibold text-sm mb-1`}>{format.label}</div>
                                            <div className={`text-xs ${selectedFormat.aspectRatio === format.aspectRatio ? 'text-white/80' : 'text-[#78716C]'}`}>{format.aspectRatio}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Preview & Download */}
                    <div className="relative">
                        <div className="sticky top-8 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-[#FED7AA] h-auto min-h-[500px] flex flex-col">
                            <h2 className="text-xl font-bold text-[#1C1917] mb-6 flex items-center gap-2">
                                <FileUp className="w-5 h-5 text-[#1C1917]" />
                                Preview Result
                            </h2>

                            <div className="flex-1 bg-[#FFFBF5] rounded-2xl overflow-hidden relative flex items-center justify-center border border-[#FED7AA]">
                                {uploading || isProcessing ? (
                                    <div className="text-center p-8 animate-pulse">
                                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#1C1917]" />
                                        <p className="text-lg font-medium text-[#1C1917] mb-2">Processing Video...</p>
                                        <p className="text-sm text-[#1C1917]/70">Uploading and generating AI crop</p>
                                        <p className="text-xs mt-2 text-[#1C1917] font-semibold">{uploadProgress}%</p>
                                    </div>
                                ) : processedUrl ? (
                                    <video
                                        src={processedUrl}
                                        controls
                                        autoPlay
                                        loop
                                        className="max-h-[500px] w-auto max-w-full"
                                        controlsList="nodownload noplaybackrate"
                                        disablePictureInPicture
                                    />
                                ) : (
                                    <div className="text-center p-8">
                                        <p className="text-sm text-[#1C1917]/70">Upload a video to see the AI magic</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleDownload}
                                disabled={!processedUrl}
                                className={`
                                    w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                                    ${processedUrl
                                        ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#FB923C] hover:to-[#F472B6] text-[#1C1917] shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5'
                                        : 'bg-[#FED7AA]/50 text-[#1C1917]/50 cursor-not-allowed'}
                                `}
                            >
                                <Download className="w-5 h-5" />
                                Download Cropped Video
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
