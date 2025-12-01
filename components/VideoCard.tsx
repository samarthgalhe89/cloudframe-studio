import React, {useState, useEffect, useCallback} from 'react'
import {getCldImageUrl, getCldVideoUrl} from "next-cloudinary"
import { ArrowDownToLine, Trash2, Clock, FileDown, FileUp } from "lucide-react";
import dayjs from 'dayjs';
import realtiveTime from "dayjs/plugin/relativeTime"
import {filesize} from "filesize"
import { Video } from '@prisma/client';

dayjs.extend(realtiveTime)

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
    onDelete: (id: string, publicId: string) => void;
}

const  VideoCard: React.FC<VideoCardProps> = ({video, onDownload, onDelete}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [previewError, setPreviewError] = useState(false)

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        })
    }, [])

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,

        })
    }, [])

    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
            rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]

        })
    }, [])

    const formatSize = useCallback((size: number) => {
        return filesize(size)
    }, [])

    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
      }, []);

      const compressionPercentage = Math.round(
        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
      );

      useEffect(() => {
        setPreviewError(false);
      }, [isHovered]);

      const handlePreviewError = () => {
        setPreviewError(true);
      };

      return (
    <div
      className="
        bg-[#E8DCC8]
        border border-[#D4C4A8]
        rounded-xl
        shadow-md
        hover:shadow-lg
        transition-all duration-300
        overflow-hidden
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail / Preview */}
      <div className="aspect-video relative">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-[#D4C4A8]">
              <p className="text-red-600 font-semibold">Preview not available</p>
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={handlePreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Duration badge */}
        <div
          className="
            absolute bottom-2 right-2 
            bg-[#F5F1E8]/80 
            backdrop-blur-sm
            px-2 py-1
            rounded-md
            text-[#6B5335]
            text-xs
            font-medium
            flex items-center
          "
        >
          <Clock size={14} className="mr-1" />
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-4 text-[#6B5335]">
        <h2 className="text-lg font-bold">{video.title}</h2>

        <p className="text-sm opacity-80 mb-2">{video.description}</p>
        <p className="text-sm opacity-80 mb-4">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <FileUp size={18} className="mr-2 text-[#6B5335]" />
            <div>
              <div className="font-semibold">Original</div>
              <div>{formatSize(Number(video.originalSize))}</div>
            </div>
          </div>

          <div className="flex items-center">
            <FileDown size={18} className="mr-2 text-[#6B5335]" />
            <div>
              <div className="font-semibold">Compressed</div>
              <div>{formatSize(Number(video.compressedSize))}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
            <div className="text-sm font-semibold">
              Compression:{" "}
              <span className="text-[#A88B5F]">{compressionPercentage}%</span>
            </div>

            <div className="flex gap-2">
              {/* Download button */}
              <button
                onClick={() =>
                  onDownload(getFullVideoUrl(video.publicId), video.title)
                }
                className="
                  bg-[#6B5335]
                  hover:bg-[#5A4329]
                  text-white
                  p-2.5
                  rounded-lg
                  transition
                  flex items-center justify-center
                "
              >
                <ArrowDownToLine size={18} strokeWidth={1.8} />
              </button>

              {/* Delete button */}
              <button
                onClick={() => onDelete(video.id, video.publicId)}
                className="
                  bg-[#C84C45]
                  hover:bg-[#A83C36]
                  text-white
                  p-2.5
                  rounded-lg
                  transition
                  flex items-center justify-center
                "
              >
                <Trash2 size={18} strokeWidth={1.8} />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard