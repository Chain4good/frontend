import { motion } from "framer-motion";
import { Shield, Sparkles, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const Banner = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="relative flex md:min-h-[85vh] py-10 flex-col justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${
            mousePosition.y * 100
          }%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 text-primary/30"
        variants={floatingAnimation}
        animate="animate"
      >
        <Sparkles size={40} />
      </motion.div>

      <motion.div
        className="absolute top-32 right-20 text-primary/30"
        variants={floatingAnimation}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <TrendingUp size={35} />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-20 text-primary/30"
        variants={floatingAnimation}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <Shield size={32} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-10 text-primary/30"
        variants={floatingAnimation}
        animate="animate"
        transition={{ delay: 0.5 }}
      >
        <Users size={38} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1">
        <div className="flex-1"></div>
        <motion.div
          className="flex items-center flex-col gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full backdrop-blur-sm"
            variants={fadeInUp}
          >
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
              #1 Nền tảng gây quỹ cộng đồng Blockchain
            </span>
            <Sparkles size={16} className="text-primary" />
          </motion.div>

          {/* Main Heading with Enhanced Effects */}
          <motion.h1
            className="md:text-8xl text-5xl font-sans text-center capitalize leading-[52px] font-bold tracking-tight md:leading-[100px] relative"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0, 0.71, 0.2, 1.01],
              scale: {
                type: "spring",
                damping: 8,
                stiffness: 100,
                restDelta: 0.001,
              },
            }}
          >
            {/* Glow Effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent blur-lg opacity-30">
              <span>Gây quỹ</span>
              <br />
              <span>Minh bạch</span>
              <br />
              <span>với Hợp đồng</span>
              <br />
              <span>Thông minh</span>
            </span>

            {/* Main Text */}
            <span className="relative bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              <span>Gây quỹ</span>
              <br />
              <span>Minh bạch</span>
              <br />
              <span>với Hợp đồng</span>
              <br />
              <span>Thông minh</span>
            </span>
          </motion.h1>

          {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative group"
          >
            {/* Button Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

            <Link to={"/create/fundraiser/category"}>
              <Button
                size="xl"
                className="relative font-bold text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 group"
              >
                <span className="flex items-center gap-2">
                  <Sparkles
                    size={20}
                    className="group-hover:rotate-12 transition-transform duration-300"
                  />
                  Bắt đầu chiến dịch
                  <TrendingUp
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Stats or Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex gap-8 mt-4"
          >
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent">
                1000+
              </div>
              <div className="text-sm text-muted-foreground">Chiến dịch</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-sm text-muted-foreground">Minh bạch</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm text-muted-foreground">Hỗ trợ</div>
            </div>
          </motion.div>
        </motion.div>
        <div className="flex-1"></div>
      </div>

      {/* Enhanced Bottom Section */}
      {/* <motion.div
        className="relative z-10 flex gap-10 pt-16 md:px-0 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="flex w-2/5 justify-end">
          <div className="relative">
            <h3 className="font-bold md:text-3xl text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-relaxed">
              Kết nối từ thiện toàn cầu <br /> với công nghệ Blockchain
            </h3>
            <div className="absolute -bottom-2 left-0 h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        <div className="flex w-3/5 justify-start">
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground md:block hidden leading-relaxed">
              <span className="font-semibold text-gray-700">
                Bắt đầu chỉ trong vài phút
              </span>{" "}
              — Với công nghệ Blockchain minh bạch,
              <br />
              bạn có thể dễ dàng tạo chiến dịch, chia sẻ câu chuyện ý nghĩa{" "}
              <br />
              và kết nối mạnh mẽ với cộng đồng để lan tỏa lòng tốt đến mọi
              người.
            </p>
            <p className="text-lg text-muted-foreground md:hidden block">
              <span className="font-semibold text-gray-700">
                Bắt đầu chỉ trong vài phút
              </span>{" "}
              — Với công nghệ Blockchain minh bạch.
            </p>

            <div className="hidden md:flex gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield size={16} className="text-primary" />
                <span>Bảo mật tuyệt đối</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp size={16} className="text-primary" />
                <span>Minh bạch 100%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={16} className="text-primary" />
                <span>Cộng đồng toàn cầu</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div> */}

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
