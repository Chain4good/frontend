import ShareModal from "@/components/ShareModal/ShareModal";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/helper";
import {
  ChartNoAxesCombined,
  Clock,
  HandHeart,
  Share,
  ExternalLink,
} from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCharityDonation } from "@/hooks/useCharityDonation";
import { formatEther, parseEther } from "ethers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import CircleProgress from "@/components/CircleProgress/CircleProgress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createDonation } from "@/services/donationService";

const FundBox = ({ campaign, onChainCampaign, donors, isDonorsLoading }) => {
  const [showAll, setShowAll] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { donateETH } = useCharityDonation();

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    try {
      setIsLoading(true);
      const { txHash, receipt } = await donateETH(
        campaign.chainCampaignId,
        amount
      );
      console.log("Receipt:", receipt);
      console.log("txHash:", txHash);
      const donation = await createDonation({
        campaignId: campaign.id,
        amount: Number(amount),
        txHash: txHash,
      });
      console.log("donation:", donation);

      toast.success("Quyên góp thành công!");
      setAmount("");
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Quyên góp thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const displayDonations = showAll ? donors : donors?.slice(0, 3);
  const progress = onChainCampaign?.totalDonated?.progress || 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <div>
          <h3 className="font-semibold text-2xl">
            {campaign.status === "FINISHED" && onChainCampaign?.goal.eth}
            {onChainCampaign?.totalDonated.eth} ETH Raise
          </h3>
          <div className="text-sm text-muted-foreground flex gap-2 items-center">
            <span className="font-semibold underline">
              {onChainCampaign?.goal.eth} ETH
            </span>
            <span>·</span>
            <span>{donors?.length || 0} Đóng góp</span>
          </div>
        </div>
        <div className="relative w-24 h-2w-24">
          {campaign.status === "FINISHED" && <CircleProgress progress={100} />}
          {campaign.status !== "FINISHED" && (
            <CircleProgress progress={progress} />
          )}
        </div>
      </div>
      <div className="flex gap-3 flex-col">
        {campaign.status !== "FINISHED" && <ShareModal campaign={campaign} />}
        {campaign.status !== "FINISHED" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg font-medium">
                <HandHeart className="mr-2 h-5 w-5" /> Quyên góp
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-center pb-2">
                  Quyên góp cho chiến dịch
                </DialogTitle>
                <p className="text-center text-muted-foreground">
                  Mọi khoản đóng góp đều có ý nghĩa, dù lớn hay nhỏ
                </p>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mục tiêu</span>
                      <span className="font-medium">
                        {onChainCampaign?.goal.eth} ETH
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Đã quyên góp
                      </span>
                      <span className="font-medium">
                        {onChainCampaign?.totalDonated.eth} ETH
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Số lượng ETH muốn quyên góp
                    </label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="pr-12 text-lg"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-muted-foreground">
                        ETH
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tối thiểu 0.01 ETH
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-lg font-medium"
                  onClick={handleDonate}
                  disabled={isLoading || !amount || Number(amount) <= 0}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">◯</span>
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận quyên góp"
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Bằng cách quyên góp, bạn đồng ý với{" "}
                  <a href="#" className="underline hover:text-primary">
                    điều khoản dịch vụ
                  </a>{" "}
                  của chúng tôi
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {campaign.status === "FINISHED" && (
          <Button size="lg" className="" variant="outline">
            <Clock /> Chiến dịch gây quỹ đã kết thúc
          </Button>
        )}
      </div>
      <div className="flex gap-4 items-center">
        <span className="size-10 rounded-full bg-slate-200 flex items-center justify-center">
          <ChartNoAxesCombined size={18} />
        </span>
        <span className="text-primary font-semibold">
          {donors?.length || 0} người đã quyên góp
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2" id="donors">
        {isDonorsLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="size-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          displayDonations?.map((donation, index) => (
            <div key={index} className="flex gap-4 items-center">
              <Avatar>
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <a
                        href={`https://sepolia.etherscan.io/address/${donation?.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        {donation?.short}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{donation?.address}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    {/* {Number(formatEther(donation.amount)).toFixed(4)} ETH */}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {/* {new Date(donation.timestamp * 1000).toLocaleDateString()} */}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowAll(!showAll)}
          disabled={!donors?.length}
        >
          {showAll ? "Ẩn bớt" : "Xem tất cả"}
        </Button>
        <Button variant="outline" className="flex-1" disabled={!donors?.length}>
          Xem top
        </Button>
      </div>
    </div>
  );
};

export default FundBox;
