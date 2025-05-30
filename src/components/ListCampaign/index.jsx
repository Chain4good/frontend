import React from "react";
import Card from "../Card/Card";
import { motion } from "framer-motion";

const ListCampaign = ({ campaigns }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 20,
    },
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {campaigns.map((campaign) => (
        <motion.div key={campaign.id} variants={item}>
          <Card campaign={campaign} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ListCampaign;
