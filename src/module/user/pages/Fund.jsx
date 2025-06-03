import FundSkeleton from "@/components/FundSkeleton";
import ReadMore from "@/components/ReadMore/ReadMore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { CampaignStatus } from "@/constants/status";
import { useCharityDonation } from "@/hooks/useCharityDonation";
import { formatCampaign, formattedDonors } from "@/lib/utils";
import { getCampaignById } from "@/services/campaignService";
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
import CommentBox from "../components/CommentBox";
import FundBox from "../components/FundBox";
import ShareModal from "../components/ShareModal";
import AnalysisResult from "@/components/AnalysisResult";
import AnalyzeButton from "@/components/AnalyzeButton";
import { Helmet } from "react-helmet-async";

const Fund = () => {
  const { id } = useParams();
  const { getCampaign, getDonors, listenToFundsWithdrawn } =
    useCharityDonation();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

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
            <h1 className="text-2xl md:text-4xl font-semibold pb-4 md:pb-6">
              {campaign.title}{" "}
              <Link to={`https://sepolia.etherscan.io/tx/${campaign?.txHash}`}>
                <Link2Icon />
              </Link>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
                  {renderMedia(campaign.cover)}
                  {campaign.status === "FINISHED" && (
                    <Badge
                      className="absolute top-4 left-4"
                      variant={"default"}
                    >
                      <CheckCircle className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      {CampaignStatus[campaign.status]}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-3 md:gap-4 items-center mt-4 pb-4">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage src={campaign?.user?.image} />
                    <AvatarFallback>CG</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm md:text-base">
                      <strong>{campaign?.user?.name}</strong> đang tổ chức buổi
                      gây quỹ
                    </div>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      {onChainCampaign?.creator}
                    </p>
                  </div>
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
                  <Carousel className="w-full">
                    <CarouselContent className="ml-2 md:ml-4">
                      {campaign?.images?.map((image, index) => (
                        <CarouselItem
                          key={index}
                          className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                        >
                          <div
                            className="rounded-md aspect-square overflow-hidden cursor-pointer"
                            onClick={() => setSelectedImage(image.url)}
                          >
                            <img
                              src={image.url}
                              alt=""
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                  </Carousel>
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
