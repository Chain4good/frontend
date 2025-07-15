import { CampaignStatusColors, CampaignStatusLabel } from "@/constants/status";
import { TOKEN } from "@/hooks/useCharityDonation";
import { cn } from "@/lib/utils";
import { truncate } from "lodash";
import { CheckCircle, Play, Pause, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ProgressBar from "../ProgressBar/ProgressBar";
import { Badge } from "../ui/badge";

const Card = ({ campaign, size, titleMaxLength }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const backgroundVideoRef = useRef(null);

  const getTokenInfo = (tokenAddress) => {
    if (!tokenAddress) return null;

    const matchingToken = Object.entries(TOKEN).find(
      ([, token]) =>
        token.address?.toLowerCase() === tokenAddress?.toLowerCase()
    );

    return matchingToken ? matchingToken[1] : null;
  };

  const tokenInfo = getTokenInfo(campaign?.tokenAddress);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const aspectRatio = video.videoWidth / video.videoHeight;
      setIsVertical(aspectRatio < 1);
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // Sync background video with main video
  useEffect(() => {
    const mainVideo = videoRef.current;
    const bgVideo = backgroundVideoRef.current;

    if (!mainVideo || !bgVideo || !isVertical) return;

    const syncVideos = () => {
      if (Math.abs(bgVideo.currentTime - mainVideo.currentTime) > 0.1) {
        bgVideo.currentTime = mainVideo.currentTime;
      }
    };

    const handleMainPlay = () => {
      bgVideo.play().catch(() => {});
      syncVideos();
    };

    const handleMainPause = () => {
      bgVideo.pause();
    };

    const handleMainSeeked = () => {
      syncVideos();
    };

    mainVideo.addEventListener("play", handleMainPlay);
    mainVideo.addEventListener("pause", handleMainPause);
    mainVideo.addEventListener("seeked", handleMainSeeked);
    mainVideo.addEventListener("timeupdate", syncVideos);

    return () => {
      mainVideo.removeEventListener("play", handleMainPlay);
      mainVideo.removeEventListener("pause", handleMainPause);
      mainVideo.removeEventListener("seeked", handleMainSeeked);
      mainVideo.removeEventListener("timeupdate", syncVideos);
    };
  }, [isVertical]);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleRestart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();
  };

  const handleProgressClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    video.currentTime = newTime;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const renderMedia = () => {
    if (campaign?.cover?.type === "VIDEO") {
      return (
        <div
          className={cn(
            "relative w-full group overflow-hidden bg-black",
            size === "lg" ? "h-full" : "h-56"
          )}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Blur background for vertical videos */}
          {isVertical && (
            <video
              ref={backgroundVideoRef}
              src={campaign?.cover?.url}
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
              muted
              playsInline
            />
          )}

          {/* Main video */}
          <video
            ref={videoRef}
            src={campaign?.cover?.url}
            className={cn(
              "relative w-full h-full transition-transform duration-300 group-hover:scale-105",
              isVertical ? "object-contain" : "object-cover"
            )}
            muted
            playsInline
            onClick={togglePlay}
          />

          {/* Video overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play/Pause overlay */}
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
              onClick={togglePlay}
            >
              <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors cursor-pointer">
                <Play className="w-6 h-6 text-black ml-0.5" />
              </div>
            </motion.div>
          )}

          {/* Custom Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: showControls || !isPlaying ? 1 : 0,
              y: showControls || !isPlaying ? 0 : 20,
            }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          >
            {/* Progress bar */}
            <div
              className="w-full h-0.5 bg-white/30 rounded-full mb-2 cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-150"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={togglePlay}
                  className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 text-white" />
                  ) : (
                    <Play className="w-3 h-3 text-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleRestart}
                  className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-white" />
                </button>
              </div>

              <div className="flex items-center gap-1 text-white text-xs">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
                {isVertical && (
                  <Badge
                    variant="outline"
                    className="text-xs border-white/30 text-white bg-white/10 ml-1"
                  >
                    Dọc
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Donation count badge */}
          <span className="absolute left-2 bottom-2 px-3 py-1 bg-slate-900 bg-opacity-90 text-white rounded-full flex items-center gap-2 text-sm backdrop-blur-sm">
            {tokenInfo && (
              <img
                src={tokenInfo.icon}
                alt={tokenInfo.symbol}
                className="w-4 h-4"
              />
            )}
            {campaign?._count?.donations} Đóng góp
          </span>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "relative w-full overflow-hidden group",
          size === "lg" ? "h-full" : "h-56"
        )}
      >
        <img
          src={campaign?.cover?.url}
          alt={campaign?.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Donation count badge for images */}
        <span className="absolute left-2 bottom-2 px-3 py-1 bg-slate-900 bg-opacity-90 text-white rounded-full flex items-center gap-2 text-sm backdrop-blur-sm">
          {tokenInfo && (
            <img
              src={tokenInfo.icon}
              alt={tokenInfo.symbol}
              className="w-4 h-4"
            />
          )}
          {campaign?._count?.donations} Đóng góp
        </span>
      </div>
    );
  };

  return (
    <Link to={`/fund/${campaign?.id}`} className="flex flex-col h-full group">
      <motion.div
        className="relative rounded-lg flex-1 overflow-hidden"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {renderMedia()}

        {/* Status badge */}
        <Badge
          className="absolute top-4 right-4 flex gap-2 items-center shadow-md backdrop-blur-sm bg-opacity-90"
          style={{
            backgroundColor: CampaignStatusColors[campaign?.status],
          }}
        >
          {campaign?.status === "FINISHED" && <CheckCircle size={18} />}
          {CampaignStatusLabel[campaign?.status]}
        </Badge>
      </motion.div>

      <div className="p-1">
        <h3
          className="font-semibold leading-none py-2 group-hover:text-primary transition-colors"
          title={campaign?.title}
        >
          {truncate(campaign?.title, { length: titleMaxLength ?? 40 })}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          Tạo bởi {campaign?.user?.name}
        </p>
        <div className="flex items-center gap-2 mb-2">
          {tokenInfo && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <img
                src={tokenInfo.icon}
                alt={tokenInfo.symbol}
                className="w-4 h-4"
              />
              <span>{tokenInfo.symbol}</span>
            </div>
          )}
        </div>
        <ProgressBar
          value={Number(campaign?.totalDonated)}
          max={Number(campaign?.tokenGoal)}
          tokenSymbol={campaign.tokenSymbol}
        />
      </div>
    </Link>
  );
};

export default Card;
