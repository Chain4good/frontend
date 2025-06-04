import TopicCard from "@/components/Topic/TopicCard";
import React from "react";

const Topic = ({ posts }) => {
  return (
    <div className="container py-10 mx-auto px-4">
      <h2
        dangerouslySetInnerHTML={{ __html: "Bài viết mới nhất" }}
        className="text-2xl md:text-3xl font-semibold text-center md:text-left"
      />
      <div className="grid gap-4 md:gap-6 mt-6 md:mt-8">
        <TopicCard layout="horizontal" post={posts?.data?.data[0]} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <TopicCard post={posts?.data?.data[1]} />
          <TopicCard post={posts?.data?.data[2]} />
          <TopicCard post={posts?.data?.data[3]} />
        </div>
      </div>
    </div>
  );
};

export default Topic;
