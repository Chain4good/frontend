import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import React from "react";

const Banner = () => {
  const t = useTranslations("Banner");
  return (
    <div className="flex md:min-h-[80vh] py-10 flex-col justify-center ">
      <div className="flex flex-1 ">
        <div className="flex-1"></div>
        <div className="flex items-center flex-col gap-4">
          <p className="text-xl font-semibold text-primary text-center mb-6">
            {t("position")}
          </p>
          <h1
            className="text-7xl text-center capitalize font-semibold leading-[90px]"
            dangerouslySetInnerHTML={{ __html: t("title") }}
          />
          <Button className="font-semibold">{t("startBtn")}</Button>
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="flex gap-10 pt-10">
        <div className="flex w-2/5 justify-end">
          <p
            className="font-semibold text-2xl"
            dangerouslySetInnerHTML={{ __html: t("description") }}
          />
        </div>
        <div className="flex w-3/5 justify-start">
          <p
            className="text-xl text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: t("suggest") }}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
