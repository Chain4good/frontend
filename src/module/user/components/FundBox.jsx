import CircleProgress from "@/components/CircleProgress/CircleProgress";
import ShareModal from "@/components/ShareModal/ShareModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TOKEN } from "@/hooks/useCharityDonation";
import useUserStore from "@/hooks/useUserStore";
import { createDonation } from "@/services/donationService";
import { generateNFTMetadata } from "@/utils/nft";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChartNoAxesCombined,
  Clock,
  ExternalLink,
  HandHeart,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import TokenSelectModal from "./TokenSelectModal";
import MintNFTModal from "./MintNFTModal";
import ConfirmMintModal from "./ConfirmMintModal";
import { useDonate } from "@/hooks/useDonate";
import TopDonorsModal from "./TopDonorsModal";

const FundBox = ({ campaign, onChainCampaign, donors, isDonorsLoading }) => {
  const [amount, setAmount] = useState("");
  const { user } = useUserStore();
  const [selectedToken, setSelectedToken] = useState(() => {
    if (!onChainCampaign?.tokenAddress) return "ETH";

    const matchingToken = Object.entries(TOKEN).find(
      ([, tokenInfo]) =>
        tokenInfo.address.toLowerCase() ===
        onChainCampaign.tokenAddress.toLowerCase()
    );

    return matchingToken ? matchingToken[0] : "ETH";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [showConfirmMint, setShowConfirmMint] = useState(false);
  const [nftMetadata, setNftMetadata] = useState(null);
  const [showTopDonors, setShowTopDonors] = useState(false);
  const { donate, isLoading: donateLoading } = useDonate();
  const queryClient = useQueryClient();

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    if (!user) {
      return toast.error("Vui lòng đăng nhập để sử dụng chức năng");
    }

    try {
      setIsLoading(true);
      const { metadata } = await donate({
        campaign,
        amount,
        selectedToken,
        user,
      });

      setNftMetadata(metadata);
      setShowConfirmMint(true);

      await Promise.all([
        queryClient.invalidateQueries([
          "campaignOnChain",
          campaign.chainCampaignId,
        ]),
        queryClient.invalidateQueries(["donors", campaign.chainCampaignId]),
        queryClient.invalidateQueries(["donationHistory", campaign.id]),
      ]);

      toast.success("Quyên góp thành công!");
      setAmount("");
      setSelectedToken("");
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Quyên góp thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMint = () => {
    setShowConfirmMint(false);
    setMintModalOpen(true);
  };

  const handleDeclineMint = () => {
    setShowConfirmMint(false);
    setNftMetadata(null);
  };

  if (!onChainCampaign) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6"
      >
        <div className="space-y-4 text-center">
          <div className="size-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Đang tải thông tin từ Blockchain</h3>
            <p className="text-sm text-muted-foreground">
              Vui lòng đợi trong giây lát...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const displayDonations = showAll ? donors : donors?.slice(0, 3);
  const progress = onChainCampaign?.totalDonated?.progress || 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6 hover-lift"
      >
        <div className="flex items-center gap-6">
          <div>
            <motion.h3
              className="font-semibold text-2xl"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              {campaign.status === "FINISHED" &&
                onChainCampaign?.goal.formatted}
              {onChainCampaign?.totalDonated.formatted}{" "}
              {onChainCampaign?.totalDonated?.symbol}
            </motion.h3>
            <div className="text-sm text-muted-foreground flex gap-2 items-center">
              <span className="font-semibold underline">
                {onChainCampaign?.goal.formatted}{" "}
                {onChainCampaign?.goal?.symbol}
              </span>
              <span>·</span>
              <span>{donors?.length || 0} Đóng góp</span>
            </div>
          </div>
          <div className="relative w-24 h-2w-24">
            {campaign.status === "FINISHED" && (
              <CircleProgress progress={100} />
            )}
            {campaign.status !== "FINISHED" && (
              <CircleProgress progress={progress} />
            )}
          </div>
        </div>
        <div className="flex gap-3 flex-col">
          {campaign.status !== "FINISHED" &&
            campaign.status !== "CANCELLED" &&
            campaign.chainCampaignId && (
              <>
                <ShareModal campaign={campaign} />
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
                            <span className="text-muted-foreground">
                              Mục tiêu
                            </span>
                            <span className="font-medium">
                              {onChainCampaign?.goal.formatted}{" "}
                              {onChainCampaign?.goal.symbol}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Đã quyên góp
                            </span>
                            <span className="font-medium">
                              {onChainCampaign?.totalDonated.formatted}{" "}
                              {onChainCampaign?.totalDonated.symbol}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Chọn token
                          </label>
                          <TokenSelectModal
                            campaignAcceptToken={onChainCampaign?.tokenAddress}
                            selectedToken={selectedToken}
                            onSelect={(token) => setSelectedToken(token.id)}
                            disabled={isLoading}
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="amount"
                            className="text-sm font-medium"
                          >
                            Số lượng {selectedToken} muốn quyên góp
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
                              {selectedToken}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Tối thiểu {selectedToken === "ETH" ? "0.01" : "1"}{" "}
                            {selectedToken}
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
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
              </>
            )}
          {(campaign.status === "FINISHED" ||
            campaign.status === "CANCELLED") && (
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

        <div className="grid grid-cols-1 gap-4" id="donors">
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
            <AnimatePresence>
              {displayDonations?.map((donation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 items-center hover-scale"
                >
                  <Avatar>
                    <AvatarImage src="/charity.png" alt="Charity" />
                    <AvatarFallback>
                      {donation.address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            to={`https://sepolia.etherscan.io/address/${donation.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary font-mono"
                          >
                            {donation.short}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>{donation.address}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-xs">
                        {donation.totalAmount.formatted}{" "}
                        {donation.totalAmount.symbol}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        · {donation.donationCount} lần quyên góp
                      </span>
                      <span className="text-xs text-muted-foreground">
                        · {donation.lastDonationFormatted}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowTopDonors(true)}
            disabled={!donors?.length}
          >
            Xem top
          </Button>
        </div>
      </motion.div>
      <ConfirmMintModal
        open={showConfirmMint}
        onOpenChange={setShowConfirmMint}
        onConfirm={handleConfirmMint}
        onDecline={handleDeclineMint}
      />
      <MintNFTModal
        open={mintModalOpen}
        onOpenChange={setMintModalOpen}
        metadata={nftMetadata}
        onSuccess={() => {
          queryClient.invalidateQueries(["userNFTs"]);
        }}
      />
      <TopDonorsModal
        open={showTopDonors}
        onOpenChange={setShowTopDonors}
        donors={donors}
      />
    </>
  );
};

export default FundBox;
