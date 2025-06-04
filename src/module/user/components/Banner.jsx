import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="flex md:min-h-[80vh] py-10 flex-col justify-center ">
      <div className="flex flex-1 ">
        <div className="flex-1"></div>
        <div className="flex items-center flex-col gap-4">
          <p className="md:text-xl text-base font-semibold font-sans text-primary text-center md:mb-6 mb-2">
            {"#1 Nền tảng gây quỹ cộng đồng Blockchain"}
          </p>
          <h1
            className="md:text-7xl text-4xl font-sans text-center capitalize leading-[48px] font-semibold tracking-tight md:leading-[90px]"
            dangerouslySetInnerHTML={{
              __html:
                "Gây quỹ <br/> Minh bạch <br/> với Hợp đồng <br/> Thông minh",
            }}
          />
          <Link to={"/create/fundraiser/category"}>
            <Button
              size="xl"
              className="font-semibold text-lg mt-2 rounded-2xl"
            >
              {"Bắt đầu chiến dịch"}
            </Button>
          </Link>
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
