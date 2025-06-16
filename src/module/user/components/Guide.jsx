import { Button } from "@/components/ui/button";
import React from "react";
import { motion } from "framer-motion";

const Guide = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="container mx-auto py-10 md:py-20 px-4 md:px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center font-semibold text-2xl md:text-4xl px-4"
        dangerouslySetInnerHTML={{
          __html: "Quyên góp với blockchain dễ dàng,<br/> bảo mật và minh bạch",
        }}
      />
      <div className="flex flex-col-reverse md:flex-row gap-6 mt-8 md:mt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex-1 bg-primary relative rounded-md min-h-[300px] md:min-h-0"
        >
          <motion.img
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[250px] md:w-[350px]"
            src="/step-3.png"
            alt="Guide illustration"
          />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex-1 flex gap-6 md:gap-8 flex-col"
        >
          {[1, 2, 3].map((step) => (
            <motion.div key={step} variants={item} className="flex gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  className="rounded-full font-semibold text-lg md:text-xl h-10 w-10 md:h-12 md:w-12 flex-shrink-0"
                >
                  {step}
                </Button>
              </motion.div>
              <div>
                <h2
                  className="font-semibold mb-2 text-xl md:text-2xl"
                  dangerouslySetInnerHTML={{
                    __html:
                      step === 1
                        ? "Sử dụng công cụ của chúng tôi để tạo chiến dịch quyên góp"
                        : step === 2
                        ? "Tiếp cận người quyên góp bằng cách chia sẻ"
                        : "Nhận quyên góp một cách bảo mật",
                  }}
                />
                <p
                  className="text-muted-foreground text-base md:text-2xl"
                  dangerouslySetInnerHTML={{
                    __html:
                      step === 1
                        ? "Giao diện đơn giản của chúng tôi sẽ hướng dẫn bạn thiết lập chiến dịch quyên góp, xác định mục tiêu và cập nhật bất kỳ lúc nào, tất cả đều với sự minh bạch của blockchain."
                        : step === 2
                        ? "Chia sẻ liên kết chiến dịch của bạn và tận dụng sức mạnh của blockchain để thu hút người quyên góp, đảm bảo mỗi khoản đóng góp đều được theo dõi và minh bạch."
                        : "Thêm thông tin ví của bạn hoặc mời người nhận quyên góp của bạn làm tương tự. Blockchain đảm bảo rằng mỗi khoản quyên góp được xử lý và ghi lại một cách bảo mật.",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Guide;
