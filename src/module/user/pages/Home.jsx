import { usePost } from "@/hooks/usePost";
import { getCampaigns } from "@/services/campaignService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Banner from "../components/Banner";
import BehindTheBanner from "../components/BehindTheBanner";
import BehindTheBanner2 from "../components/BehindTheBanner2";
import Discover from "../components/Discover";
import Guide from "../components/Guide";
import HowWork from "../components/HowWork";
import KeyFeature from "../components/KeyFeature";
import Topic from "../components/Topic";

export default function Home() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 4,
  });
  const { data: posts, isLoading } = usePost(filters);
  // const { data: recommendationsData } = useQuery({
  //   queryKey: ["recommendations"],
  //   queryFn: () => recommendations(),
  //   enabled: true,
  // });

  const { data: campaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () =>
      getCampaigns({
        page: 1,
        limit: 6,
      }),
  });
  return (
    <>
      <Helmet>
        <title>Trang chủ | Chain4Good</title>
        <meta
          name="description"
          content="Nền tảng gây quỹ từ thiện phi tập trung. Quyên góp và giúp đỡ người khác một cách minh bạch."
        />
        <meta property="og:title" content="Trang chủ | Chain4Good" />
        <meta
          property="og:description"
          content="Nền tảng gây quỹ từ thiện phi tập trung. Quyên góp và giúp đỡ người khác một cách minh bạch."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <main className="relative min-h-screen">
        <section className="relative w-full">
          <div className="relative z-10">
            <Banner />
          </div>
          <BehindTheBanner />
          <BehindTheBanner2 campaigns={campaigns} />
        </section>
        <KeyFeature />
        <Guide />
        <div className="container mx-auto px-4 py-8">
          <Discover campaigns={campaigns} />
        </div>
        <Topic posts={posts} />
        <HowWork />
      </main>
    </>
  );
}
