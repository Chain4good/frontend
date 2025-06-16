import Card from "@/components/Card/Card";
import { getCampaigns } from "@/services/campaignService";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const Discover = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () =>
      getCampaigns({
        page: 1,
        limit: 5,
      }),
  });

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
    <section className="py-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-semibold mb-6 md:mb-10 text-2xl md:text-3xl text-center md:text-left"
        dangerouslySetInnerHTML={{
          __html:
            "Khám phá những người gây quỹ lấy cảm hứng từ những gì bạn quan tâm",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
      >
        {/* Featured campaign */}
        {campaigns?.data?.[0] && (
          <motion.div variants={item} className="h-full">
            <Card
              size="lg"
              titleMaxLength={50}
              className="col-span-1 md:col-span-1"
              campaign={campaigns.data[0]}
            />
          </motion.div>
        )}

        {/* Grid of other campaigns */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8"
        >
          {campaigns?.data?.slice(1, 5).map((campaign) => (
            <motion.div key={campaign.id} variants={item}>
              <Card campaign={campaign} titleMaxLength={30} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Discover;
