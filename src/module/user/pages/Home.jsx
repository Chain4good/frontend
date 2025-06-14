import { Helmet } from "react-helmet-async";
import Banner from "../components/Banner";
import Discover from "../components/Discover";
import Guide from "../components/Guide";
import KeyFeature from "../components/KeyFeature";
import Topic from "../components/Topic";
import { usePost } from "@/hooks/usePost";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { recommendations } from "@/services/aiService";

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
        </section>
        <KeyFeature />
        <Guide />
        <div className="container mx-auto px-4 py-8">
          <Discover />
        </div>
        <Topic posts={posts} />
      </main>
    </>
  );
}

const BehindTheBanner = () => {
  return (
    <>
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="flex h-[600px] w-[600px] items-center justify-center rounded-full border border-dashed border-gray-200 md:h-[1300px] md:w-[1300px]">
          <div className="h-[300px] w-[300px] rounded-full border border-dashed md:h-[600px] md:w-[600px]"></div>
        </div>
      </div>
      <div className="-z-20 blur-2xl hidden md:flex gap-10 flex-col items-center justify-center text-9xl top-0 left-0 right-0 bottom-0 absolute">
        {/* Desktop layout */}
        <div className="flex gap-80">
          <img
            src="/hero-animals-2.png"
            className="animate-gentleFloat w-[140px] h-[140px]"
            alt="hero-animals-2.png"
          />
          <img
            src="/hero-business-1.png"
            className="animate-gentleFloat3 w-[140px] h-[140px]"
            alt="hero-business-1.png"
          />
        </div>
        <div className="flex gap-[800px]">
          <img
            src="/hero-education-1.png"
            className="animate-gentleFloat2 w-[140px] h-[140px]"
            alt="hero-education-1.png"
          />
          <img
            src="/hero-business-4.png"
            className="animate-gentleFloat3 w-[140px] h-[140px]"
            alt="hero-business-4.png"
          />
        </div>
        <div className="flex gap-80">
          <img
            src="/hero-education-2.png"
            className="animate-gentleFloat2 w-[140px] h-[140px]"
            alt="hero-education-2.png"
          />
          <img
            src="/hero-education-3.png"
            className="animate-gentleFloat w-[140px] h-[140px]"
            alt="hero-education-3.png"
          />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="-z-20 blur-2xl flex md:hidden gap-6 flex-col items-center justify-center text-9xl top-0 left-0 right-0 bottom-0 absolute">
        <div className="flex gap-20">
          <img
            src="/hero-animals-2.png"
            className="animate-gentleFloat w-[80px] h-[80px]"
          />
          <img
            src="/hero-business-1.png"
            className="animate-gentleFloat3 w-[80px] h-[80px]"
          />
        </div>
        <div className="flex gap-32">
          <img
            src="/hero-education-1.png"
            className="animate-gentleFloat2 w-[80px] h-[80px]"
          />
          <img
            src="/hero-business-4.png"
            className="animate-gentleFloat3 w-[80px] h-[80px]"
          />
        </div>
        <div className="flex gap-20">
          <img
            src="/hero-education-2.png"
            className="animate-gentleFloat2 w-[80px] h-[80px]"
          />
          <img
            src="/hero-education-3.png"
            className="animate-gentleFloat w-[80px] h-[80px]"
          />
        </div>
      </div>
    </>
  );
};
