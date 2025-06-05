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

const Fund = () => {
  const { id } = useParams();
  const { getCampaign, getDonors, listenToFundsWithdrawn, getCampaignStatus } =
    useCharityDonation();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [campaignStatus, setCampaignStatus] = useState(null);

  const {
    data: campaign,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaignById(id),
    enabled: !!id,
  });

  const renderMedia = (cover) => {
    if (!cover) return null;

    if (cover.type === "VIDEO") {
      return (
        <VideoPlayer
          src={cover.url}
          // onVideoClick={() => setSelectedImage(cover.url)}
        />
      );
    }

    return (
      <img
        className="rounded-lg shadow-md w-full h-96 object-cover"
        src={cover.url}
        onClick={() => setSelectedImage(cover.url)}
        alt={campaign.title}
      />
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: onChainCampaign, isLoading: isOnChainLoading } = useQuery({
    queryKey: ["campaignOnChain", campaign?.chainCampaignId],
    queryFn: async () => {
      const data = await getCampaign(campaign.chainCampaignId);
      return formatCampaign(data);
    },
    enabled: !!campaign?.chainCampaignId,
  });

  const { data: donors, isLoading: isDonorsLoading } = useQuery({
    queryKey: ["donors", campaign?.chainCampaignId],
    queryFn: async () => {
      const data = await getDonors(campaign.chainCampaignId);
      return formattedDonors(data);
    },
    enabled: !!campaign?.chainCampaignId,
  });

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
    const fetchCampaignStatus = async () => {
      try {
        const status = await getCampaignStatus(campaign.chainCampaignId);
        const { isActive, isSuccessful, remainingTime } = status;

        setCampaignStatus({
          isActive,
          isSuccessful,
          remainingTime: Number(remainingTime),
        });

        // Update campaign status logic
        if (!isActive && isSuccessful) {
          // Campaign finished successfully
          updateCampaign(campaign.id, {
            status: "FINISHED",
          });
        } else if (!isActive && !isSuccessful) {
          // Campaign ended but didn't reach goal
          updateCampaign(campaign.id, {
            status: "CANCELLED",
          });
        }
      } catch (error) {
        console.error("Error fetching campaign status:", error);
      }
    };

    if (campaign?.chainCampaignId) {
      fetchCampaignStatus();
    }
  }, [campaign?.chainCampaignId]);

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
      console.log("Analysis complete:", data);
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
        {error && <div>Error: {error.message}</div>}
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

                <div className="mt-8">
                  {donationHistory && (
                    <DonationChart
                      data={donationHistory.data}
                      summary={donationHistory.summary}
                    />
                  )}
                </div>

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
