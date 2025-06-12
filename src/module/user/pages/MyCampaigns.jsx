import React, { useState } from "react";
import CampaignCard from "../components/CampaignCard";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, HeartHandshake } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  calculateGoal,
  getMyCampaigns,
  updateCampaign,
} from "@/services/campaignService";
import CampaignSkeleton from "@/components/CampaignSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";
import { TOKEN, useCharityDonation } from "@/hooks/useCharityDonation";
import { toast } from "sonner";
import { parseEther, parseUnits } from "ethers";
import { CampaignStatus } from "@/constants/status";

const MyCampaigns = () => {
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
  });
  const { createCampaign, closeCampaign } = useCharityDonation();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedToken, setSelectedToken] = useState("ETH");
  const queryClient = useQueryClient();
  const [isClosing, setIsClosing] = useState(false);

  const {
    data: campaigns,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-campaigns", filters],
    queryFn: () => getMyCampaigns(filters.page, filters.limit),
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto mt-16 px-4 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <CampaignSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div>Error: {error.message}</div>;

  const handleCreateContract = async (campaign, selectedToken) => {
    setIsCreating(true);
    try {
      const now = new Date();
      const deadline = new Date(campaign.deadline);
      if (deadline <= now) {
        toast.error("Thời gian hết hạn chiến dịch đã quá hạn.");
        return;
      }

      const durationInMinutes = Math.floor((deadline - now) / (1000 * 60));

      // Get token details using passed selectedToken
      const token = TOKEN[selectedToken];
      const tokenAddress = token.address;
      let tokenGoal;
      let goalInWei;
      if (selectedToken === "ETH" || selectedToken === "WETH") {
        const ethAmount = await calculateGoal(campaign.goal, token.tokenName);
        tokenGoal = ethAmount;
        goalInWei = parseEther(ethAmount.toFixed(token.decimals));
      } else {
        const usdAmount = await calculateGoal(campaign.goal, token.tokenName);
        tokenGoal = usdAmount;
        goalInWei = parseUnits(
          usdAmount.toFixed(token.decimals),
          token.decimals
        );
      }

      const { chainCampaignId, txHash } = await createCampaign(
        campaign.title,
        tokenAddress,
        goalInWei.toString(),
        Math.floor(durationInMinutes),
        campaign.isNoLimit
      );

      await updateCampaign(campaign.id, {
        chainCampaignId,
        txHash,
        status: CampaignStatus.ACTIVE,
        tokenAddress: token.address,
        tokenGoal: tokenGoal.toString(),
        tokenSymbol: token.symbol,
        tokenDecimals: token.decimals,
      });

      await queryClient.invalidateQueries(["my-campaigns"]);
      toast.success("Hợp đồng đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating contract:", error);

      if (error.code === "ACTION_REJECTED") {
        toast.error("Bạn đã từ chối ký giao dịch");
        return;
      }

      toast.error(`Không thể tạo hợp đồng: ${error.message}`);
      throw error; // Re-throw to trigger catch block in CampaignCard
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseCampaign = async (campaign) => {
    try {
      setIsClosing(true);
      await closeCampaign(campaign.chainCampaignId);
      await updateCampaign(campaign.id, {
        status: CampaignStatus.FINISHED,
      });
      toast.success("Đã đóng chiến dịch thành công!");
      queryClient.invalidateQueries(["my-campaigns"]);
    } catch (error) {
      console.error("Error closing campaign:", error);
      if (error.code === "ACTION_REJECTED") {
        toast.error("Bạn đã từ chối ký giao dịch");
        return;
      }
      toast.error("Không thể đóng chiến dịch: " + error.message);
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Chiến dịch của tôi | Chain4Good</title>
        <meta
          name="description"
          content="Quản lý và theo dõi các chiến dịch gây quỹ từ thiện của bạn trên Chain4Good. Tạo chiến dịch mới và theo dõi tiến độ quyên góp."
        />
        <meta property="og:title" content="Chiến dịch của tôi | Chain4Good" />
        <meta
          property="og:description"
          content="Quản lý và theo dõi các chiến dịch gây quỹ từ thiện của bạn trên Chain4Good. Tạo chiến dịch mới và theo dõi tiến độ quyên góp."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto mt-16 px-4 min-h-screen ">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Chiến dịch của tôi</h1>
            <p className="text-gray-600">
              Quản lý các chiến dịch gây quỹ của bạn
            </p>
          </div>
          <Link to="/create/fundraiser/category">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo chiến dịch mới
            </Button>
          </Link>
        </div>

        {!campaigns || campaigns?.data?.length === 0 ? (
          <div className="text-center py-12">
            <HeartHandshake className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold">Chưa có chiến dịch nào</h2>
            <p className="text-gray-600">
              Bắt đầu bằng cách tạo chiến dịch đầu tiên của bạn
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns?.data?.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                handleCreateContract={handleCreateContract}
                handleCloseCampaign={handleCloseCampaign}
                isClosing={isClosing}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyCampaigns;
