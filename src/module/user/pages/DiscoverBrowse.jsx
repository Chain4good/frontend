import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCampaignsByCategoryId } from "@/services/campaignService";
import { getCategoryById } from "@/services/categoryService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { HeartHandshake } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";
import CampaignCard from "../components/CampaignCard";
import Card from "@/components/Card/Card";

const DiscoverBrowse = () => {
  const { id } = useParams();
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
  });

  const { data: category, isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });

  const { data: campaigns } = useQuery({
    queryKey: ["campaigns", id],
    queryFn: () => getCampaignsByCategoryId(id, filters.page, filters.limit),
    enabled: !!id,
  });

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <div className="py-6 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:h-[60vh] items-center">
        <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-8">
          <div className="text-3xl md:text-[56px] leading-tight md:leading-[67.2px] tracking-[-1.12px] font-semibold">
            Danh mục {category?.name?.toLowerCase()}{" "}
            <br className="hidden md:block" /> gây quỹ trên Chain4Good
          </div>
          <p className="text-base md:text-lg text-muted-foreground">
            Giúp đỡ người khác bằng cách quyên góp cho người gây quỹ của họ,
            hoặc bắt đầu một người cho người mà bạn quan tâm.
          </p>
          <Button className="w-fit text-sm md:text-base rounded-xl" size="lg">
            Tạo chiến dịch
          </Button>
        </div>
        <div className="col-span-1 h-[200px] md:h-full">
          <img
            src="/photo-category-animals@2x.jpg"
            className="w-full h-full object-cover rounded-xl shadow-sm"
            alt={`${category?.name} category`}
          />
        </div>
      </div>

      <Separator className="my-4 md:my-8" />

      {/* Campaign List Section */}
      <div>
        <div className="pb-4 text-xl md:text-[24px] leading-tight md:leading-[28.8px] font-semibold">
          Danh mục {category?.name?.toLowerCase()}
        </div>
        <div>
          {campaigns?.data?.length === 0 ? (
            <div className="text-center py-10 md:py-20">
              <HeartHandshake className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-lg md:text-xl font-semibold">
                Chưa có chiến dịch nào
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Bắt đầu bằng cách tạo chiến dịch đầu tiên của bạn
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {campaigns?.data?.map((campaign) => (
                <Card key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverBrowse;
