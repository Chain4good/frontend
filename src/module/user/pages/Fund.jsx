import { Separator } from "@/components/ui/separator";
import FundSkeleton from "@/components/FundSkeleton";
import ReadMore from "@/components/ReadMore/ReadMore";
import AnalysisResult from "@/components/AnalysisResult";
import AnalyzeButton from "@/components/AnalyzeButton";
import DonationChart from "@/components/DonationChart";
import { Helmet } from "react-helmet-async";
import FundHeader from "../components/Fund/FundHeader";
import FundMedia from "../components/Fund/FundMedia";
import FundCreator from "../components/Fund/FundCreator";
import FundGallery from "../components/Fund/FundGallery";
import CommentBox from "../components/CommentBox";
import FundBox from "../components/FundBox";
import ShareModal from "../components/ShareModal";
import { CampaignStatus } from "@/constants/status";
import { useCharityDonation } from "@/hooks/useCharityDonation";
import { formatCampaign, formattedDonors } from "@/lib/utils";
import { getCampaignById, updateCampaign } from "@/services/campaignService";
import {
  createComment,
  getCommentsByCampaign,
} from "@/services/commentService";
import { analyzeCampaign } from "@/services/aiService";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Link2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDonationHistory } from "@/services/donationService";
import ReportCampaignButton from "@/components/ReportCampaignButton";
import CreateProgressDialog from "../components/CreateProgressDialog";
import ProgressList from "../components/ProgressList";
import useUserStore from "@/hooks/useUserStore";
import Forbidden from "../components/Forbidden";

const Fund = () => {
  const { id } = useParams();
  const {
    getCampaign,
    getDonors,
    listenToFundsWithdrawn,
    getCampaignStatus,
    listenToDonationMade,
    getCampaignCloseHistory,
  } = useCharityDonation();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [campaignStatus, setCampaignStatus] = useState(null);
  const { user } = useUserStore();

  const {
    data: campaign,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaignById(id),

    enabled: !!id,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: onChainCampaign, isLoading: isOnChainLoading } = useQuery({
    queryKey: ["campaignOnChain", campaign?.chainCampaignId],
    queryFn: async () => {
      const data = await getCampaign(campaign.chainCampaignId);
      console.log("data", data);

      return formatCampaign(data);
    },
    enabled: !!campaign?.chainCampaignId,
  });

  const { data: donors, isLoading: isDonorsLoading } = useQuery({
    queryKey: ["donors", campaign?.chainCampaignId],
    queryFn: async () => {
      const data = await getDonors(campaign.chainCampaignId);
      return formattedDonors(data, onChainCampaign?.tokenAddress);
    },
    enabled: !!campaign?.chainCampaignId,
  });

  const { data: closeHistory, isLoading: isCloseHistoryLoading } = useQuery({
    queryKey: ["campaignCloseHistory", campaign?.chainCampaignId],
    queryFn: async () => {
      try {
        const history = await getCampaignCloseHistory(campaign.chainCampaignId);
        return history;
      } catch (error) {
        if (error?.code === 4100) {
          throw new Error("Vui lòng kết nối ví để xem thông tin này");
        }
        throw error;
      }
    },
    enabled: !!campaign?.chainCampaignId,
    retry: false, // Don't retry on error
  });
  console.log(closeHistory);

  useEffect(() => {
    let cleanupFunction;

    const setupListener = async () => {
      if (campaign?.chainCampaignId) {
        try {
          cleanupFunction = await listenToFundsWithdrawn(
            campaign.chainCampaignId,
            id
          );
        } catch (error) {
          console.error("Error setting up event listener:", error);
        }
      }
    };

    setupListener();

    return () => {
      if (typeof cleanupFunction === "function") {
        cleanupFunction();
      }
    };
  }, [campaign?.chainCampaignId, id, listenToFundsWithdrawn]);

  useEffect(() => {
    let cleanupFunction;

    const setupListener = async () => {
      if (campaign?.chainCampaignId) {
        try {
          cleanupFunction = await listenToDonationMade(
            campaign.chainCampaignId,
            () => {
              queryClient.invalidateQueries([
                "campaignOnChain",
                campaign.chainCampaignId,
              ]);
              queryClient.invalidateQueries([
                "donors",
                campaign.chainCampaignId,
              ]);
              queryClient.invalidateQueries(["donationHistory", id]);
            }
          );
        } catch (error) {
          console.error("Error setting up event listener:", error);
        }
      }
    };

    setupListener();

    return () => {
      if (typeof cleanupFunction === "function") {
        cleanupFunction();
      }
    };
  }, [campaign?.chainCampaignId, id, listenToDonationMade, queryClient]);

  useEffect(() => {
    const fetchCampaignStatus = async () => {
      try {
        const status = await getCampaignStatus(campaign.chainCampaignId);
        const { isActive, isSuccessful, remainingTime } = status;

        setCampaignStatus({
          isActive,
          isSuccessful,
          remainingTime: Number(remainingTime),
        });

        if (!isActive) {
          if (isSuccessful) {
            updateCampaign(campaign.id, {
              status: "FINISHED",
            });
          } else {
            updateCampaign(campaign.id, {
              status: "CANCELLED",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching campaign status:", error);
      }
    };

    if (campaign?.chainCampaignId) {
      fetchCampaignStatus();
    }
  }, [campaign?.chainCampaignId, onChainCampaign]);

  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["comments", campaign?.id],
    queryFn: () => getCommentsByCampaign(campaign.id),
    enabled: !!campaign?.id,
  });

  const { mutate: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", campaign?.id]);
    },
  });

  const { mutate: replyToComment, isPending: isReplying } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", campaign?.id]);
    },
  });

  const { mutate: analyzeContent, isPending: isAnalyzing } = useMutation({
    mutationFn: analyzeCampaign,
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
    onError: (error) => {
      console.error("Analysis failed:", error);
    },
  });

  const handleAddComment = (content) => {
    addComment({
      content,
      campaignId: campaign.id,
    });
  };

  const handleReply = (content, parentId) => {
    replyToComment({
      content,
      campaignId: campaign.id,
      parentId,
    });
  };

  const handleAnalyzeCampaign = () => {
    if (!campaign) return;

    analyzeContent({
      title: campaign.title,
      description: campaign.description,
    });
  };

  const { data: donationHistory } = useQuery({
    queryKey: ["donationHistory", id],
    queryFn: () => getDonationHistory(id),
    enabled: !!id,
  });
  return (
    <>
      <Helmet>
        <title>
          {campaign?.title
            ? `${campaign.title} | Chain4Good`
            : "Chiến dịch | Chain4Good"}
        </title>
        <meta
          name="description"
          content={
            campaign?.description?.slice(0, 155) ||
            "Tham gia đóng góp vào chiến dịch từ thiện trên Chain4Good. Mọi giao dịch đều minh bạch và được lưu trữ trên blockchain."
          }
        />
        <meta
          property="og:title"
          content={
            campaign?.title
              ? `${campaign.title} | Chain4Good`
              : "Chiến dịch | Chain4Good"
          }
        />
        <meta
          property="og:description"
          content={
            campaign?.description?.slice(0, 155) ||
            "Tham gia đóng góp vào chiến dịch từ thiện trên Chain4Good. Mọi giao dịch đều minh bạch và được lưu trữ trên blockchain."
          }
        />
        <meta property="og:image" content={campaign?.cover?.url || ""} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container py-6 md:py-10 px-4 md:px-6">
        {isLoading && <FundSkeleton />}
        {error && error?.statusCode === 403 && <Forbidden />}
        {campaign && (
          <>
            <FundHeader campaign={campaign} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="col-span-1 md:col-span-2">
                <FundMedia
                  cover={campaign.cover}
                  campaignStatus={campaignStatus}
                  onImageClick={setSelectedImage}
                />

                <FundCreator
                  campaign={campaign}
                  onChainCampaign={onChainCampaign}
                />

                <Separator className="my-6 md:my-8" />
                <div className="mb-6">
                  <AnalyzeButton
                    onClick={handleAnalyzeCampaign}
                    isAnalyzing={isAnalyzing}
                  />
                  {(analysisResult || isAnalyzing) && (
                    <AnalysisResult
                      analysis={analysisResult}
                      isLoading={isAnalyzing}
                    />
                  )}
                </div>

                <Separator />
                <ReadMore
                  className="text-base md:text-lg mt-4 md:mt-6"
                  text={campaign?.description}
                />

                <Separator className="my-6 md:my-8" />
                <div className="mt-4 md:mt-6">
                  {campaign?.status === "ACTIVE" && (
                    <div className="flex justify-end">
                      {campaign?.userId === user?.id && (
                        <CreateProgressDialog campaignId={id} />
                      )}
                    </div>
                  )}
                  <ProgressList campaignId={id} />
                </div>

                <div className="mt-8">
                  {donationHistory && (
                    <DonationChart
                      symbol={campaign?.tokenSymbol}
                      data={donationHistory.data}
                      summary={donationHistory.summary}
                    />
                  )}
                </div>

                <Separator className="my-6 md:my-8" />
                <div className="mt-4 md:mt-6">
                  <FundGallery
                    images={campaign.images}
                    onImageClick={setSelectedImage}
                  />
                </div>

                <Separator className="my-6 md:my-8" />

                <div className="mt-6 md:mt-8">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4">
                    Bình luận
                  </h2>
                  <CommentBox
                    comments={comments}
                    onAddComment={handleAddComment}
                    onReply={handleReply}
                    isLoading={isCommentsLoading}
                    isSubmitting={isAddingComment || isReplying}
                  />
                </div>
                {/* Add progress section */}
              </div>

              <div className="col-span-1 order-first md:order-none mb-4 md:mb-0">
                <FundBox
                  donors={donors}
                  onChainCampaign={onChainCampaign}
                  campaign={campaign}
                  isDonorsLoading={isDonorsLoading}
                />
                <div className="flex justify-end mt-4">
                  <ReportCampaignButton campaignId={campaign.id} />
                </div>
              </div>
            </div>

            <ShareModal />
          </>
        )}
      </div>
    </>
  );
};

export default Fund;
