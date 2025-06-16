import TopicCard from "@/components/Topic/TopicCard";
import React from "react";
import { motion } from "framer-motion";

const Topic = ({ posts }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="container py-10 mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        dangerouslySetInnerHTML={{ __html: "Bài viết mới nhất" }}
        className="text-2xl md:text-3xl font-semibold text-center md:text-left"
      />
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-4 md:gap-6 mt-6 md:mt-8"
      >
        <motion.div variants={item}>
          <TopicCard layout="horizontal" post={posts?.data?.data[0]} />
        </motion.div>
        <motion.div
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {[1, 2, 3].map((index) => (
            <motion.div key={index} variants={item}>
              <TopicCard post={posts?.data?.data[index]} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Topic;
