import { Badge } from "@/components/ui/badge";
import { Clock, Target, Pickaxe, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import { Link, useNavigate } from "react-router-dom";
import { useCharityDonation } from "@/hooks/useCharityDonation";
import { toast } from "sonner";
import { parseEther } from "ethers";
import { calculateEthGoal, updateCampaign } from "@/services/campaignService";
import { ADDRESS_ZERO } from "@/constants";
import { useState } from "react";

const CampaignCard = ({ campaign }) => {
  const { createCampaign } = useCharityDonation();
  const [isCreating, setIsCreating] = useState(false);
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

  const handleCreateContract = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const now = new Date();
      const deadline = new Date(campaign.deadline);
      if (deadline <= now) {
        toast.error("Thời gian hết hạn chiến dịch đã quá hạn.");
        return;
      }
      const durationInMinutes = Math.floor((deadline - now) / (1000 * 60));

      const ethAmount = await calculateEthGoal(campaign.goal);
      const goalInWei = parseEther(ethAmount.toFixed(18));
      const { chainCampaignId, txHash } = await createCampaign(
        campaign.title,
        ADDRESS_ZERO,
        goalInWei,
        durationInMinutes * 60,
        campaign.isNoLimit
      );
      const campaignUpdate = await updateCampaign(campaign.id, {
        chainCampaignId,
        txHash,
      });
      toast.success("Hợp đồng đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating contract:", error);
      toast.error("Không thể tạo hợp đồng: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on the create contract button
    if (e.target.closest("button")) {
      return;
    }
    navigate(`/fund/${campaign.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border relative rounded-lg cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
              <span>{campaign.goal.eth} ETH</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{campaign.deadline}</span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${campaign.totalDonated.progress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Đã gây quỹ: {campaign.totalDonated.eth} ETH</span>
            <span>{campaign.totalDonated.progress}%</span>
          </div>

          {campaign.status === "ACTIVE" && !campaign.chainCampaignId && (
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
          )}
          {campaign.chainCampaignId && (
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
        variant={campaign.status === "ACTIVE" ? "default" : "secondary"}
      >
        {campaign.status}
      </Badge>
    </div>
  );
};

export default CampaignCard;
