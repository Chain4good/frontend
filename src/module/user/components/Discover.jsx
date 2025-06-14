import Card from "@/components/Card/Card";
import { getCampaigns } from "@/services/campaignService";
import { useQuery } from "@tanstack/react-query";

const Discover = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () =>
      getCampaigns({
        page: 1,
        limit: 5,
      }),
  });

  return (
    <section className="py-10">
      <h2
        className="font-semibold mb-6 md:mb-10 text-2xl md:text-3xl text-center md:text-left"
        dangerouslySetInnerHTML={{
          __html:
            "Khám phá những người gây quỹ lấy cảm hứng từ những gì bạn quan tâm",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Featured campaign */}
        {campaigns?.data?.[0] && (
          <Card
            size="lg"
            titleMaxLength={50}
            className="col-span-1 md:col-span-1"
            campaign={campaigns.data[0]}
          />
        )}

        {/* Grid of other campaigns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          {campaigns?.data?.slice(1, 5).map((campaign) => (
            <Card key={campaign.id} campaign={campaign} titleMaxLength={30} />
          ))}
        </div>
      </div>

      {/* {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg" />
            </div>
          ))}
        </div>
      )} */}
    </section>
  );
};

export default Discover;
