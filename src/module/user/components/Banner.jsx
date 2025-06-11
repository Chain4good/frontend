import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Banner = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="flex md:min-h-[80vh] py-10 flex-col justify-center">
      <div className="flex flex-1">
        <div className="flex-1"></div>
        <div className="flex items-center flex-col gap-4">
          <motion.p
            className="md:text-xl text-base font-semibold font-sans text-primary text-center md:mb-6 mb-2"
            {...fadeInUp}
          >
            {"#1 Nền tảng gây quỹ cộng đồng Blockchain"}
          </motion.p>
          <motion.h1
            className="md:text-7xl text-4xl font-sans text-center capitalize leading-[48px] font-semibold tracking-tight md:leading-[90px] gradient-text text-glow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0, 0.71, 0.2, 1.01],
              scale: {
                type: "spring",
                damping: 5,
                stiffness: 100,
                restDelta: 0.001,
              },
            }}
          >
            <span>Gây quỹ</span>
            <br />
            <span>Minh bạch</span>
            <br />
            <span>với Hợp đồng</span>
            <br />
            <span>Thông minh</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to={"/create/fundraiser/category"}>
              <Button
                size="xl"
                className="font-semibold text-lg mt-2 rounded-2xl hover:scale-105 transition-transform"
              >
                {"Bắt đầu chiến dịch"}
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="flex gap-10 pt-10 md:px-0 px-4">
        <div className="flex w-2/5 justify-end">
          <p
            className="font-semibold md:text-2xl text-base"
            dangerouslySetInnerHTML={{
              __html:
                "Kết nối từ thiện toàn cầu <br/> với công nghệ Blockchain.*",
            }}
          />
        </div>
        <div className="flex w-3/5 justify-start">
          <p
            className="text-xl text-muted-foreground md:block hidden"
            dangerouslySetInnerHTML={{
              __html:
                "Bắt đầu chỉ trong vài phút — Với công nghệ Blockchain minh bạch,<br/> bạn có thể dễ dàng tạo chiến dịch, chia sẻ câu chuyện ý nghĩa <br/> và kết nối mạnh mẽ với cộng đồng để lan tỏa lòng tốt đến mọi người.",
            }}
          />
          <p
            className="text-xl text-muted-foreground md:hidden block"
            dangerouslySetInnerHTML={{
              __html:
                "Bắt đầu chỉ trong vài phút — Với công nghệ Blockchain minh bạch.",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
