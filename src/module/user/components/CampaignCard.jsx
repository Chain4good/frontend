import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CampaignStatus,
  CampaignStatusColors,
  CampaignStatusLabel,
} from "@/constants/status";
import { formatDate } from "@/lib/utils";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { isNumber } from "lodash";
import { Clock, Eye, Pickaxe, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TokenSelectModal from "./TokenSelectModal";

const CampaignCard = ({
  campaign,
  handleCreateContract,
  isCreating,
  selectedToken,
  setSelectedToken,
}) => {
  // const { createCampaign } = useCharityDonation();
  // const [isCreating, setIsCreating] = useState(false);
  // const [selectedToken, setSelectedToken] = useState("ETH");
  const navigate = useNavigate();

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
      className="border relative rounded-lg cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
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
              {/* <span>{campaign.goal.eth} ETH</span> */}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDate(campaign.deadline)}</span>
            </div>
          </div>

          {/* <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${campaign.totalDonated.progress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Đã gây quỹ: {campaign.totalDonated.symbol}</span>
            <span>{campaign.totalDonated.progress}%</span>
          </div> */}

          {campaign.status === CampaignStatus.APPROVED &&
            !campaign.chainCampaignId && (
              <div className="space-y-4">
                <TokenSelectModal
                  selectedToken={selectedToken}
                  onSelect={(token) => {
                    console.log("Selected token:", token);
                    setSelectedToken(token.id);
                  }}
                />
                <Button
                  onClick={handleCreateContract}
                  className="w-full"
                  variant="outline"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <span className="animate-spin mr-2">◯</span>
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
      <Badge
        className="absolute top-4 right-4"
        style={{
          backgroundColor: CampaignStatusColors[campaign.status],
        }}
      >
        {CampaignStatusLabel[campaign.status]}
      </Badge>
    </motion.div>
  );
};

export default CampaignCard;
