import { Button } from "@/components/ui/button";
import React from "react";

const Guide = () => {
  return (
    <div className="container mx-auto py-10 md:py-20 px-4 md:px-6">
      <h2
        className="text-center font-semibold text-2xl md:text-4xl px-4"
        dangerouslySetInnerHTML={{
          __html: "Quyên góp với blockchain dễ dàng,<br/> bảo mật và minh bạch",
        }}
      />
      <div className="flex flex-col-reverse md:flex-row gap-6 mt-8 md:mt-16">
        {/* Image container */}
        <div className="flex-1 bg-primary relative rounded-md min-h-[300px] md:min-h-0">
          <img
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[250px] md:w-[350px]"
            src="/step-3.png"
            alt="Guide illustration"
          />
        </div>

        {/* Steps container */}
        <div className="flex-1 flex gap-6 md:gap-8 flex-col">
          {/* Step 1 */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="rounded-full font-semibold text-lg md:text-xl h-10 w-10 md:h-12 md:w-12 flex-shrink-0"
            >
              1
            </Button>
            <div>
              <h2
                className="font-semibold mb-2 text-xl md:text-2xl"
                dangerouslySetInnerHTML={{
                  __html:
                    "Sử dụng công cụ của chúng tôi để tạo chiến dịch quyên góp",
                }}
              />
              <p
                className="text-muted-foreground text-base md:text-2xl"
                dangerouslySetInnerHTML={{
                  __html:
                    "Giao diện đơn giản của chúng tôi sẽ hướng dẫn bạn thiết lập chiến dịch quyên góp, xác định mục tiêu và cập nhật bất kỳ lúc nào, tất cả đều với sự minh bạch của blockchain.",
                }}
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="rounded-full font-semibold text-lg md:text-xl h-10 w-10 md:h-12 md:w-12 flex-shrink-0"
            >
              2
            </Button>
            <div>
              <h2
                className="font-semibold mb-2 text-xl md:text-2xl"
                dangerouslySetInnerHTML={{
                  __html: "Tiếp cận người quyên góp bằng cách chia sẻ",
                }}
              />
              <p
                className="text-muted-foreground text-base md:text-2xl"
                dangerouslySetInnerHTML={{
                  __html:
                    "Chia sẻ liên kết chiến dịch của bạn và tận dụng sức mạnh của blockchain để thu hút người quyên góp, đảm bảo mỗi khoản đóng góp đều được theo dõi và minh bạch.",
                }}
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="rounded-full font-semibold text-lg md:text-xl h-10 w-10 md:h-12 md:w-12 flex-shrink-0"
            >
              3
            </Button>
            <div>
              <h2
                className="font-semibold mb-2 text-xl md:text-2xl"
                dangerouslySetInnerHTML={{
                  __html: "Nhận quyên góp một cách bảo mật",
                }}
              />
              <p
                className="text-muted-foreground text-base md:text-2xl"
                dangerouslySetInnerHTML={{
                  __html:
                    "Thêm thông tin ví của bạn hoặc mời người nhận quyên góp của bạn làm tương tự. Blockchain đảm bảo rằng mỗi khoản quyên góp được xử lý và ghi lại một cách bảo mật.",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;
