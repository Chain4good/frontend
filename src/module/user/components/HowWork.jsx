import React from "react";
import { motion } from "framer-motion";

const HowWork = () => {
  return (
    <div className="container mx-auto py-10 md:py-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-semibold"
        >
          Chain4Good hoạt động như thế nào?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm md:text-base"
        >
          Tìm hiểu cách chúng tôi sử dụng blockchain để mang lại sự minh bạch và
          hiệu quả cho hoạt động từ thiện
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="aspect-video relative rounded-lg overflow-hidden shadow-lg"
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/s3T8fksKawA?si=LArPaJDEroNRJArG&amp;start=19"
          title="Chain4Good - Nền tảng gây quỹ từ thiện phi tập trung"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </motion.div>
    </div>
  );
};

export default HowWork;
