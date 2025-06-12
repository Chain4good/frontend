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
  Lock, // Add Lock import
  Pickaxe,
  Target,
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

  // Update handleCreate to manage internal isCreating state
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
        <video
          src={campaign.cover.url}
          className="w-full h-48 object-cover"
          controls
          muted
        >
          <source src={campaign.cover.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <img
        src={campaign.cover.url}
        alt={campaign.title}
        className="w-full h-48 object-cover"
      />
    );
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on the create contract button
    if (e.target.closest("button")) {
      return;
    }
    if (e.target.closest("select")) {
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
        "border relative rounded-lg cursor-pointer overflow-hidden shadow-sm hover:shadow-md",
        isExpired && "opacity-75"
      )}
    >
      {renderMedia()}
      <div className="p-4">
        <h3
          className="text-xl font-semibold mb-2 truncate"
          title={campaign.title}
        >
          {campaign.title}
        </h3>
        <div
          className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(campaign.description),
          }}
        />

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <Clock
                className={cn("w-4 h-4", isExpired && "text-destructive")}
              />
              <span className={cn(isExpired && "text-destructive font-medium")}>
                {isExpired ? "Đã hết hạn" : formatDate(campaign.deadline)}
              </span>
            </div>
          </div>
          {/* <>
            {campaign.status === CampaignStatus.ACTIVE && (
            
            )}
          </> */}
          {/* {campaign.status === CampaignStatus.ACTIVE &&
            isNumber(campaign.chainCampaignId) && (
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleCloseCampaign(campaign);
                }}
                className="w-full"
                variant="destructive"
                disabled={isClosing}
              >
                {isClosing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang đóng chiến dịch...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Đóng chiến dịch
                  </>
                )}
              </Button>
            )} */}
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
                  className="w-full"
                  variant="outline"
                  disabled={isCreating || isExpired}
                >
                  {isExpired ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2 text-destructive" />
                      Chiến dịch đã hết hạn
                    </>
                  ) : isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Đang tạo hợp đồng...
                    </>
                  ) : (
                    <>
                      <Pickaxe className="w-4 h-4 mr-2" />
                      Tạo hợp đồng
                    </>
                  )}
                </Button>
              </div>
            )}
          {isNumber(campaign.chainCampaignId) && (
            <a
              href={`https://sepolia.etherscan.io/tx/${campaign.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem hợp đồng
            </a>
          )}
        </div>
      </div>

      {/* Status badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isExpired && <Badge variant="destructive">Đã hết hạn</Badge>}
        <Badge
          style={{ backgroundColor: CampaignStatusColors[campaign.status] }}
        >
          {CampaignStatusLabel[campaign.status]}
        </Badge>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
