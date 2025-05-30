import { Gem, Origami, Zap } from "lucide-react";
import React from "react";

const KeyFeature = () => {
  const features = [
    {
      icon: <Origami className="w-5 h-5" />,
      text: "Minh bạch và không có phí",
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

  return (
    <div className="bg-[#F9F4CB] text-primary py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2 text-sm md:text-base">
                {feature.icon}
                <span>{feature.text}</span>
              </div>
              {index < features.length - 1 && (
                <hr className="hidden md:block w-20 border border-primary border-dashed" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyFeature;
