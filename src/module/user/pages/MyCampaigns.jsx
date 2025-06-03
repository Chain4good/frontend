import React from "react";
import CampaignCard from "../components/CampaignCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, HeartHandshake } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyCampaigns } from "@/services/campaignService";
import CampaignSkeleton from "@/components/CampaignSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";

const MyCampaigns = () => {
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
  });

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
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyCampaigns;
