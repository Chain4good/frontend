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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TokenSelectModal from "./TokenSelectModal";

const CampaignCard = ({
  campaign,
  handleCreateContract,
  handleCloseCampaign,
  isClosing,
}) => {
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const isExpired = new Date(campaign.deadline) <= new Date();

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

  const renderMedia = () => {
    if (campaign.cover.type === "VIDEO") {
      return (
        <div className="relative w-full h-48 group overflow-hidden">
          <video
            src={campaign.cover.url}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            controls
            muted
          >
            <source src={campaign.cover.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
