import { BicepsFlexed, Send, ShieldCheck } from "lucide-react";
import React from "react";

const Brand = () => {
  return (
    <div className="bg-primary/10 py-8 md:py-[88px]">
      <div className="container mx-auto px-4 md:px-0">
        <div className="mb-8 md:mb-12 text-lg md:text-[20px] font-semibold leading-6 text-center md:text-left">
          Nhà dễ dàng, mạnh mẽ và đáng tin cậy của bạn để được giúp đỡ
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          <div className="flex gap-4 items-center">
            <Send className="w-8 h-8 md:w-8 md:h-8" strokeWidth={0.75} />
            <div>
              <div className="font-semibold">Dễ dàng</div>
              <span className="text-sm md:text-base text-muted-foreground">
                Quyên góp nhanh chóng và dễ dàng
              </span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <BicepsFlexed
              className="w-8 h-8 md:w-8 md:h-8"
              strokeWidth={0.75}
            />
            <div>
              <div className="font-semibold">Mạnh mẽ</div>
              <span className="text-sm md:text-base text-muted-foreground">
                Gửi sự giúp đỡ ngay cho mọi người
              </span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <ShieldCheck className="w-8 h-8 md:w-8 md:h-8" strokeWidth={0.75} />
            <div>
              <div className="font-semibold">Đáng tin cậy</div>
              <span className="text-sm md:text-base text-muted-foreground">
                Hợp đồng thông minh
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand;
