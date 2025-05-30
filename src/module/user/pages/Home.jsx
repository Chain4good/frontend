import Topic from "../components/Topic";
import Banner from "../components/Banner";
import Guide from "../components/Guide";
import KeyFeature from "../components/KeyFeature";
import Discover from "../components/Discover";
import CampaignList from "@/components/CampaignList/CampaignList";
import CreateCampaign from "@/components/CreateCampaign/CreateCampaign";

export default function Home() {
  return (
    <main className="">
      <section className="relative">
        {/* Fixed typo: session -> section */}
        <div className="">
          <Banner />
        </div>
        <BehindTheBanner />
      </section>
      <KeyFeature />
      <Guide />
      <div className="container mx-auto px-4">
        {" "}
        {/* Added padding for mobile */}
        <Discover />
      </div>
      <Topic />
    </main>
  );
}

const BehindTheBanner = () => {
  return (
    <>
      <div className="-z-10 bl absolute flex items-center overflow-hidden justify-center top-0 left-0 right-0 bottom-0">
        <div className=" md:size-[1300px] size-[600px] rounded-full border border-dashed border-gray-200 flex items-center justify-center">
          <div className="size-[300px] md:size-[600px] rounded-full border border-dashed"></div>
        </div>
      </div>
      <div className="-z-20 blur-2xl hidden md:flex gap-10 flex-col items-center justify-center text-9xl top-0 left-0 right-0 bottom-0 absolute">
        {/* Desktop layout */}
        <div className="flex gap-80">
          <img
            src="/hero-animals-2.png"
            className="animate-gentleFloat w-[140px] h-[140px]"
          />
          <img
            src="/hero-business-1.png"
            className="animate-gentleFloat3 w-[140px] h-[140px]"
          />
        </div>
        <div className="flex gap-[800px]">
          <img
            src="/hero-education-1.png"
            className="animate-gentleFloat2 w-[140px] h-[140px]"
          />
          <img
            src="/hero-business-4.png"
            className="animate-gentleFloat3 w-[140px] h-[140px]"
          />
        </div>
        <div className="flex gap-80">
          <img
            src="/hero-education-2.png"
            className="animate-gentleFloat2 w-[140px] h-[140px]"
          />
          <img
            src="/hero-education-3.png"
            className="animate-gentleFloat w-[140px] h-[140px]"
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
