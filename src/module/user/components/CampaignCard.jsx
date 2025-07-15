import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CampaignStatus,
  CampaignStatusColors,
  CampaignStatusLabel,
} from "@/constants/status";
import { cn, formatDate } from "@/lib/utils";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { isNumber } from "lodash";
import {
  AlertCircle,
  Clock,
  Eye,
  Loader2,
  Lock,
  Pickaxe,
  Target,
  Calendar,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import TokenSelectModal from "./TokenSelectModal";

const CampaignCard = ({ campaign, handleCreateContract }) => {
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [isCreating, setIsCreating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const backgroundVideoRef = useRef(null);
  const navigate = useNavigate();
  const isExpired = new Date(campaign.deadline) <= new Date();

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

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      await handleCreateContract(campaign, selectedToken);
    } catch (error) {
      console.error("Error creating contract:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const togglePlay = (e) => {
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
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();
  };

  const handleProgressClick = (e) => {
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
    if (campaign.cover.type === "VIDEO") {
      return (
        <div
          className="relative w-full h-48 group overflow-hidden bg-black"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Blur background for vertical videos */}
          {isVertical && (
            <video
              ref={backgroundVideoRef}
              src={campaign.cover.url}
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
              muted
              playsInline
            />
          )}

          {/* Main video */}
          <video
            ref={videoRef}
            src={campaign.cover.url}
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
              <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors cursor-pointer">
                <Play className="w-8 h-8 text-black ml-1" />
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
            className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          >
            {/* Progress bar */}
            <div
              className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer overflow-hidden"
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
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleRestart}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-white text-xs">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
                {isVertical && (
                  <Badge
                    variant="outline"
                    className="text-xs border-white/30 text-white bg-white/10"
                  >
                    Dọc
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-48 group overflow-hidden">
        <img
          src={campaign.cover.url}
          alt={campaign.title}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    );
  };

  const handleCardClick = (e) => {
    if (e.target.closest("button") || e.target.closest("select")) {
      return;
    }
    navigate(`/fund/${campaign.id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative rounded-xl cursor-pointer overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300",
        isExpired && "opacity-75"
      )}
    >
      {renderMedia()}
      <div className="p-6">
        <h3
          className="text-xl font-semibold mb-3 truncate hover:text-primary transition-colors duration-200"
          title={campaign.title}
        >
          {campaign.title}
        </h3>
        <div
          className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 h-10 overflow-hidden prose dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(campaign.description),
          }}
        />

        <div className="space-y-4">
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Target className="w-4 h-4" />
              <span>Mục tiêu</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar
                className={cn("w-4 h-4", isExpired && "text-destructive")}
              />
              <span
                className={cn(
                  "transition-colors",
                  isExpired && "text-destructive font-medium"
                )}
              >
                {isExpired ? "Đã hết hạn" : formatDate(campaign.deadline)}
              </span>
            </div>
          </div>

          {campaign.status === CampaignStatus.APPROVED &&
            !isNumber(campaign.chainCampaignId) && (
              <div className="space-y-4">
                <TokenSelectModal
                  selectedToken={selectedToken}
                  onSelect={(token) => setSelectedToken(token.id)}
                  disabled={isExpired}
                />
                <Button
                  onClick={handleCreate}
                  className="w-full transition-all duration-200 hover:scale-[1.02]"
                  variant="outline"
                  disabled={isCreating || isExpired}
                >
                  {isExpired ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2 text-destructive" />
                      <span>Chiến dịch đã hết hạn</span>
                    </>
                  ) : isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Đang tạo hợp đồng...</span>
                    </>
                  ) : (
                    <>
                      <Pickaxe className="w-4 h-4 mr-2" />
                      <span>Tạo hợp đồng</span>
                      <ChevronRight className="w-4 h-4 ml-auto transition-transform duration-200 transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            )}

          {isNumber(campaign.chainCampaignId) && (
            <motion.a
              href={`https://sepolia.etherscan.io/tx/${campaign.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:scale-[1.02]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4 mr-2" />
              <span>Xem hợp đồng</span>
              <ChevronRight className="w-4 h-4 ml-auto transition-transform duration-200 transform group-hover:translate-x-1" />
            </motion.a>
          )}
        </div>
      </div>

      <motion.div
        className="absolute top-4 right-4 flex gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {isExpired && (
          <Badge
            variant="destructive"
            className="shadow-md backdrop-blur-sm bg-opacity-90"
          >
            Đã hết hạn
          </Badge>
        )}
        <Badge
          className="shadow-md backdrop-blur-sm bg-opacity-90"
          style={{ backgroundColor: CampaignStatusColors[campaign.status] }}
        >
          {CampaignStatusLabel[campaign.status]}
        </Badge>
      </motion.div>
    </motion.div>
  );
};

export default CampaignCard;
