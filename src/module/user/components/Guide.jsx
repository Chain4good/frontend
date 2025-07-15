import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const Guide = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const floatingIcon = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: [0.3, 0.8, 0.3],
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const FloatingParticle = ({ delay = 0 }) => (
    <motion.div
      className="absolute w-2 h-2 bg-primary/30 rounded-full"
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        y: [-50, -150],
        x: [0, Math.random() * 40 - 20],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    />
  );

  return (
    <div className="relative container mx-auto my-8 py-16 md:py-24 px-4 md:px-6 overflow-hidden">
      {/* Background Gradient Effect */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl" /> */}

      {/* Floating Background Icons */}
      <motion.div
        className="absolute top-10 left-10"
        variants={floatingIcon}
        initial="initial"
        animate="animate"
      >
        <Sparkles className="w-8 h-8 text-primary/20" />
      </motion.div>
      <motion.div
        className="absolute top-20 right-16"
        variants={floatingIcon}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "1s" }}
      >
        <Shield className="w-6 h-6 text-primary/20" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-20"
        variants={floatingIcon}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "2s" }}
      >
        <Users className="w-7 h-7 text-primary/20" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-10"
        variants={floatingIcon}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "0.5s" }}
      >
        <TrendingUp className="w-6 h-6 text-primary/20" />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.5} />
      ))}

      {/* Enhanced Main Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-4"
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Quy trình blockchain an toàn
          </span>
        </motion.div>

        <motion.h2
          className="font-bold text-3xl md:text-5xl lg:text-6xl bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent leading-tight"
          whileHover={{ scale: 1.02 }}
          dangerouslySetInnerHTML={{
            __html:
              "Quyên góp với blockchain dễ dàng<br/> <span class='relative text-primary'>bảo mật và minh bạch<span class='absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent blur-xl'></span></span>",
          }}
        />

        <motion.p
          className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Trải nghiệm quyên góp thế hệ mới với công nghệ blockchain tiên tiến
        </motion.p>
      </motion.div>

      <div className="flex flex-col-reverse lg:flex-row gap-8 md:gap-12 mt-12 md:mt-20">
        {/* Enhanced Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex-1 relative"
        >
          <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl min-h-[350px] md:min-h-[650px] overflow-hidden shadow-2xl">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse" />
              <div
                className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20 animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>

            <motion.img
              // whileHover={{ y: -15, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] md:w-[380px] drop-shadow-2xl"
              src="/step-3.png"
              alt="Guide illustration"
            />

            {/* Floating Success Badge */}
            <motion.div
              className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm rounded-full p-3"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <CheckCircle className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Steps Section */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex-1 flex gap-8 md:gap-10 flex-col"
        >
          {[
            {
              title:
                "Sử dụng công cụ của chúng tôi để tạo chiến dịch quyên góp",
              description:
                "Giao diện đơn giản của chúng tôi sẽ hướng dẫn bạn thiết lập chiến dịch quyên góp, xác định mục tiêu và cập nhật bất kỳ lúc nào, tất cả đều với sự minh bạch của blockchain.",
              icon: <TrendingUp className="w-5 h-5" />,
            },
            {
              title: "Tiếp cận người quyên góp bằng cách chia sẻ",
              description:
                "Chia sẻ liên kết chiến dịch của bạn và tận dụng sức mạnh của blockchain để thu hút người quyên góp, đảm bảo mỗi khoản đóng góp đều được theo dõi và minh bạch.",
              icon: <Users className="w-5 h-5" />,
            },
            {
              title: "Nhận quyên góp một cách bảo mật",
              description:
                "Thêm thông tin ví của bạn hoặc mời người nhận quyên góp của bạn làm tương tự. Blockchain đảm bảo rằng mỗi khoản quyên góp được xử lý và ghi lại một cách bảo mật.",
              icon: <Shield className="w-5 h-5" />,
            },
          ].map((step, index) => (
            <motion.div
              key={index + 1}
              variants={item}
              className="group relative"
              whileHover={{ x: 10 }}
            >
              {/* Connecting Line */}
              {index < 2 && (
                <div className="absolute left-6 top-16 w-px h-8 bg-gradient-to-b from-primary to-primary/30" />
              )}

              <div className="flex gap-5 items-start">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button
                    variant="outline"
                    className="rounded-full font-bold text-lg md:text-xl h-12 w-12 md:h-14 md:w-14 flex-shrink-0 border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all duration-300 shadow-lg group-hover:shadow-primary/25"
                  >
                    {index + 1}
                  </Button>

                  {/* Icon Badge */}
                  <motion.div
                    className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1.5 shadow-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {step.icon}
                  </motion.div>
                </motion.div>

                <div className="flex-1 group-hover:translate-x-2 transition-transform duration-300">
                  <h3 className="font-bold mb-3 text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow indicator */}
                  <motion.div
                    className="inline-flex items-center gap-2 mt-3 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm">Tìm hiểu thêm</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center mt-16 md:mt-20"
      >
        <motion.button
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-5 h-5 group-hover:animate-spin" />
          <span>Bắt đầu quyên góp ngay</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary/90 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Guide;
