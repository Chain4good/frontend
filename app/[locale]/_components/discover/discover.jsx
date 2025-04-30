import Card from "@/components/card/card";
import { useTranslations } from "next-intl";
import React from "react";

const Discover = () => {
  const t = useTranslations("Discover");
  return (
    <section className=" py-10">
      <h2
        className="font-semibold mb-10 text-3xl"
        dangerouslySetInnerHTML={{ __html: t("title") }}
      />
      <div className=" grid grid-cols-2 gap-8">
        <Card />
        <div className="grid grid-cols-2 gap-8">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </section>
  );
};

export default Discover;
