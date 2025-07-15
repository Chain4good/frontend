import { Gem, Origami, Zap } from "lucide-react";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';

const FEATURES = [
  {
    icon: <Origami className="w-5 h-5" />,
    text: "Miễn phí",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    text: "Giao dịch nhanh chóng", 
  },
  {
    icon: <Gem className="w-5 h-5" />,
    text: "Đảm bảo tính bảo mật và an toàn",
  },
];

const ANIMATION_CONFIG = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  }
};

const KeyFeature = () => {
  // Memoize animation variants để tránh re-render không cần thiết
  const { container, item } = useMemo(() => ANIMATION_CONFIG, []);

  return (
    <motion.div
      initial="hidden"
      whileInView="show" 
      viewport={{ once: true }}
      className="bg-[#F9F4CB] text-primary py-8"
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={container}
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4"
        >
          {FEATURES.map((feature, index) => (
            <React.Fragment key={index}>
              <motion.div
                variants={item}
                className="flex items-center gap-2 text-sm md:text-base hover:scale-105 transition-transform"
              >
                {feature.icon}
                <span>{feature.text}</span>
              </motion.div>
              
              {index < FEATURES.length - 1 && (
                <motion.hr
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="hidden md:block w-20 border border-primary border-dashed"
                />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

KeyFeature.propTypes = {
  className: PropTypes.string
};

export default React.memo(KeyFeature);
