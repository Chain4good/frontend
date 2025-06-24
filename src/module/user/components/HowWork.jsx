import { motion } from "framer-motion";
import {
  Heart,
  Maximize,
  Play,
  Shield,
  Sparkles,
  Star,
  Users,
  Volume2,
  Zap,
} from "lucide-react";
import { useState } from "react";

const HowWork = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const floatingIcon = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: [0.2, 0.6, 0.2],
      y: [0, -30, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const FloatingElement = ({ children, delay = 0, duration = 4 }) => (
    <motion.div
      className="absolute"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1.2, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );

  const StatCard = ({ icon, number, label, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 300 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-primary/20 shadow-xl hover:shadow-primary/25 transition-all duration-300"
    >
      <motion.div
        className="text-primary mb-2"
        whileHover={{ rotate: 10, scale: 1.1 }}
      >
        {icon}
      </motion.div>
      <motion.div
        className="text-2xl md:text-3xl font-bold text-primary mb-1"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {number}
      </motion.div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );

  return (
    <div className="relative container mx-auto my-8 py-16 md:py-24 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br  rounded-3xl" />

      {/* Floating Background Icons */}
      <motion.div
        className="absolute top-16 left-8"
        variants={floatingIcon}
        initial="initial"
        animate="animate"
      >
        <Sparkles className="w-8 h-8 text-primary/20" />
      </motion.div>
      <motion.div
        className="absolute top-32 right-12"
        variants={floatingIcon}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "1s" }}
      >
        <Shield className="w-6 h-6 text-primary/20" />
      </motion.div>
      <motion.div
        className="absolute bottom-24 left-16"
        variants={floatingIcon}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "2s" }}
      >
        <Heart className="w-7 h-7 text-primary/20" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-8"
        variants={floatingIcon}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "0.5s" }}
      >
        <Zap className="w-6 h-6 text-primary/20" />
      </motion.div>

      {/* Floating Elements Around Video */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement delay={0}>
          <Star className="w-4 h-4 text-primary/40" />
        </FloatingElement>
        <FloatingElement delay={1} duration={5}>
          <div className="w-2 h-2 bg-primary/50 rounded-full" />
        </FloatingElement>
        <FloatingElement delay={2} duration={3}>
          <Heart className="w-3 h-3 text-primary/30" />
        </FloatingElement>
      </div>

      {/* Enhanced Header Section */}
      <div className="max-w-4xl mx-auto text-center space-y-6 mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-4"
        >
          <Play className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Video giới thiệu
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent leading-tight"
          whileHover={{ scale: 1.02 }}
        >
          Chain4Good hoạt động như thế nào?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Tìm hiểu cách chúng tôi sử dụng{" "}
          <span className="text-primary font-semibold">blockchain</span> để mang
          lại sự
          <span className="text-primary font-semibold"> minh bạch</span> và{" "}
          <span className="text-primary font-semibold">hiệu quả</span> cho hoạt
          động từ thiện
        </motion.p>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto"
        >
          <StatCard
            icon={<Users className="w-6 h-6" />}
            number="1000+"
            label="Người dùng"
            delay={0.1}
          />
          <StatCard
            icon={<Shield className="w-6 h-6" />}
            number="100%"
            label="Minh bạch"
            delay={0.2}
          />
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            number="500+"
            label="Chiến dịch"
            delay={0.3}
          />
          <StatCard
            icon={<Zap className="w-6 h-6" />}
            number="24/7"
            label="Hoạt động"
            delay={0.4}
          />
        </motion.div>
      </div>

      {/* Enhanced Video Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="relative max-w-5xl mx-auto"
      >
        {/* Video Container with Enhanced Styling */}
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Main Video Container */}
          <motion.div
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Loading Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: isPlaying ? 0 : 0.3 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-primary/60"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-16 h-16 md:w-20 md:h-20" />
              </motion.div>
            </motion.div>

            {/* Video iframe */}
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/s3T8fksKawA?si=LArPaJDEroNRJArG&amp;start=19"
              title="Chain4Good - Nền tảng gây quỹ từ thiện phi tập trung"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              frameBorder="0"
              allowFullScreen
              onLoad={() => setIsPlaying(false)}
            />

            {/* Video Controls Overlay */}
            {/* <motion.div
              className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Maximize className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div> */}
          </motion.div>

          {/* Corner Decorations */}
          <motion.div
            className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/40 rounded-tl-lg"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          />
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-primary/40 rounded-tr-lg"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          />
          <motion.div
            className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-primary/40 rounded-bl-lg"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          />
          <motion.div
            className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/40 rounded-br-lg"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          />
        </div>
      </motion.div>

      {/* Enhanced Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="text-center mt-12 md:mt-16"
      >
        <motion.p
          className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Xem video để hiểu rõ hơn về cách chúng tôi đang cách mạng hóa ngành từ
          thiện
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-semibold rounded-full shadow-lg hover:shadow-primary/50 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Bắt đầu ngay</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary/90 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
          </motion.button>

          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 border border-primary/30 text-primary hover:bg-primary/10 font-semibold rounded-full transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Tìm hiểu thêm</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HowWork;
