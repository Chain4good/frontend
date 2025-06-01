import RemoteSVG from "@/components/RemoteSVG/RemoteSVG";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/hooks/useCategory";
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Discover = () => {
  const { data: categories } = useCategory();

  return (
    <>
      <Helmet>
        <title>Khám phá chiến dịch | Chain4Good</title>
        <meta
          name="description"
          content="Khám phá các chiến dịch từ thiện theo danh mục. Tìm và quyên góp cho những dự án phù hợp với đam mê của bạn."
        />
        <meta property="og:title" content="Khám phá chiến dịch | Chain4Good" />
        <meta
          property="og:description"
          content="Khám phá các chiến dịch từ thiện theo danh mục. Tìm và quyên góp cho những dự án phù hợp với đam mê của bạn."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 md:gap-8 py-4 md:py-6">
          <h2 className="text-3xl md:text-7xl leading-tight md:leading-none tracking-tight">
            Tìm chiến dịch <br /> theo danh mục
          </h2>
          <p className="text-lg md:text-3xl text-muted-foreground">
            Mọi người trên thế giới đang quyên góp tiền cho những gì họ đang có{" "}
            <br className="hidden md:block" />
            đam mê về.
          </p>
          <Button className="w-fit text-sm md:text-base rounded-xl" size="lg">
            Tạo chiến dịch
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories?.data?.map((category) => (
            <Link
              key={category.id}
              to={`/discover/${category.id}`}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-full aspect-square flex items-center hover:border rounded-md transition justify-center p-4 md:p-6">
                <img
                  src={category.icon}
                  className="w-3/4 md:w-2/4 fill-transparent"
                  alt={category.name}
                />
              </div>
              <div className="text-sm md:text-base text-center">
                {category.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Discover;
