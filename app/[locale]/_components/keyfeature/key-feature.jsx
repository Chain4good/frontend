import { Gem, Origami, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const KeyFeature = () => {
  const t = useTranslations("KeyFeature");
  return (
    <div className="bg-[#F9F4CB] text-primary gap-4  py-8 items-center justify-center flex ">
      <div className="flex gap-2 items-center">
        <Origami />
        <span>{t("feature1")}</span>
      </div>
      <hr className="w-20 border  border-primary border-dashed" />
      <div className="flex gap-2 items-center">
        <Zap />
        <span>{t("feature2")}</span>
      </div>
      <hr className="w-20 border border-primary border-dashed" />
      <div className="flex gap-2 items-center">
        <Gem />
        <span>{t("feature3")}</span>
      </div>
    </div>
  );
};

export default KeyFeature;
