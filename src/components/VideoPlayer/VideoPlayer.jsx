import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const VideoPlayer = ({ src, onVideoClick, className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoAspectRatio, setVideoAspectRatio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const backgroundVideoRef = useRef(null);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      videoRef.current.pause();
      backgroundVideoRef.current?.pause();
    } else {
      videoRef.current.play();
      backgroundVideoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);

    // Sync background video
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.currentTime = videoRef.current.currentTime;
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
    setIsLoading(false);

    // Calculate aspect ratio
    const video = videoRef.current;
    const aspectRatio = video.videoWidth / video.videoHeight;
    setVideoAspectRatio(aspectRatio);
  };

  const handleSeek = (value) => {
    const time = (value[0] / 100) * duration;
    videoRef.current.currentTime = time;
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.currentTime = time;
    }
    setProgress(value[0]);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleFullScreen = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const restartVideo = (e) => {
    e.stopPropagation();
    videoRef.current.currentTime = 0;
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.currentTime = 0;
    }
  };

  // Check if video is vertical (portrait)
  const isVertical = videoAspectRatio !== null && videoAspectRatio < 1;

  useEffect(() => {
    const video = videoRef.current;
    const handleEnded = () => setIsPlaying(false);

    if (video) {
      video.addEventListener("ended", handleEnded);
      return () => video.removeEventListener("ended", handleEnded);
    }
  }, []);

  return (
    <div className={cn("relative group w-full", className)}>
      {/* Container with proper aspect ratio */}
      <div className="relative w-full md:h-[450px] h-80 rounded-lg overflow-hidden shadow-lg bg-black">
        {/* Blur background for vertical videos */}
        {isVertical && !isLoading && (
          <video
            ref={backgroundVideoRef}
            className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 opacity-30"
            muted
            autoPlay
            loop={false}
            onTimeUpdate={() => {}} // Prevent event bubbling
          >
            <source src={src} type="video/mp4" />
          </video>
        )}

        {/* Main video */}
        <video
          ref={videoRef}
          className={cn(
            "relative z-10 cursor-pointer transition-all duration-300",
            isVertical
              ? "w-auto h-full max-w-full mx-auto object-contain"
              : "w-full h-full object-cover"
          )}
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={onVideoClick}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white text-sm">Đang tải video...</span>
            </div>
          </div>
        )}

        {/* Play button overlay for paused state */}
        {!isPlaying && !isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 hover:bg-black/70 transition-colors">
              <Play className="w-12 h-12 text-white ml-1" />
            </div>
          </div>
        )}

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
          <div className="flex flex-col gap-3">
            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <span className="text-white text-xs min-w-[40px]">
                {formatTime(videoRef.current?.currentTime || 0)}
              </span>
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                className="cursor-pointer flex-1"
                onValueChange={handleSeek}
              />
              <span className="text-white text-xs min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {/* Play/Pause button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                {/* Restart button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={restartVideo}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                {/* Mute button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                {/* Video info */}
                {videoAspectRatio && (
                  <div className="ml-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
                    {isVertical ? "Dọc" : "Ngang"}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                {/* Fullscreen button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={toggleFullScreen}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
