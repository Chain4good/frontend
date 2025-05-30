import TopicCard from "@/components/Topic/TopicCard";
import React from "react";

const Topic = () => {
  return (
    <div className="container py-10 mx-auto px-4">
      <h2
        dangerouslySetInnerHTML={{ __html: "Featured topics" }}
        className="text-2xl md:text-3xl font-semibold text-center md:text-left"
      />
      <div className="grid gap-4 md:gap-6 mt-6 md:mt-8">
        {/* Horizontal card - full width on all devices */}
        <TopicCard layout="horizontal" />

        {/* Grid of cards - responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <TopicCard />
          <TopicCard />
          <TopicCard />
        </div>
      </div>
    </div>
  );
};

export default Topic;
