import TopicCard from "@/components/topic/card/card";
import { useTranslations } from "next-intl";
import React from "react";

const Topic = () => {
  const t = useTranslations("FeaturedTopics");
  return (
    <div className=" container py-10 mx-auto">
      <h2
        dangerouslySetInnerHTML={{ __html: t("title") }}
        className="text-3xl font-semibold"
      />
      <div className=" grid gap-6 mt-8">
        <TopicCard layout="horizontal" />
        <div className="grid grid-cols-3 gap-6">
          <TopicCard />
          <TopicCard />
          <TopicCard />
        </div>
      </div>
    </div>
  );
};

export default Topic;
