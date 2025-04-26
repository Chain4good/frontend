"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCampaign } from "@/lib/charityContract";
import { Pen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Banner from "./_components/banner/banner";
import Image from "next/image";
import KeyFeature from "./_components/keyfeature/key-feature";
import Guide from "./_components/guide/guide";
import Discover from "./_components/discover/discover";
import TopicCard from "@/components/topic/card/card";
import Topic from "./_components/topic/topic";

export default function HomePage() {
  const [campaign, setCampaign] = useState({
    title: "",
    goal: 0,
    duration: 0,
    isNoLimit: false,
  });

  const t = useTranslations("Home");

  const handleChange = (e) => {
    setCampaign({ ...campaign, [e.target.name]: e.target.value });
  };

  const handleCreateCampaign = async () => {
    const res = await createCampaign(
      campaign.title,
      campaign.goal,
      campaign.duration,
      campaign.isNoLimit
    );
    console.log(res);
  };

  return (
    <main className="">
      <session className="relative">
        <div className="pt-20 ">
          <Banner />
        </div>
        <BehindTheBanner />
      </session>
      <KeyFeature />
      <Guide />
      <Discover />
      <Topic />
    </main>
  );
}

const BehindTheBanner = () => {
  return (
    <>
      <div className="-z-10 bl absolute flex items-center overflow-hidden justify-center top-0 left-0 right-0 bottom-0">
        <div className="size-[1300px] rounded-full border border-dashed border-gray-200  flex items-center justify-center ">
          <div className="size-[600px] rounded-full border border-dashed"></div>
        </div>
      </div>
      <div className="-z-20 blur-2xl flex gap-10 flex-col items-center justify-center text-9xl top-0 left-0 right-0 bottom-0 absolute">
        <div className="flex gap-80">
          <Image
            src={"/hero-animals-2.png"}
            className="animate-gentleFloat"
            width={140}
            height={140}
          />
          <Image
            src={"/hero-business-1.png"}
            className="animate-gentleFloat3"
            width={140}
            height={140}
          />
        </div>
        <div className="flex gap-[800px]">
          <Image
            src={"/hero-education-1.png"}
            className="animate-gentleFloat2"
            width={140}
            height={140}
          />
          <Image
            src={"/hero-business-4.png"}
            className="animate-gentleFloat3"
            width={140}
            height={140}
          />
        </div>
        <div className="flex gap-80">
          <Image
            src={"/hero-education-2.png"}
            className="animate-gentleFloat2"
            width={140}
            height={140}
          />
          <Image
            src={"/hero-education-3.png"}
            className="animate-gentleFloat"
            width={140}
            height={140}
          />
        </div>
      </div>
    </>
  );
};
