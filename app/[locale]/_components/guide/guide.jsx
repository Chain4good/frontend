import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const Guide = () => {
  const t = useTranslations("Guide");
  return (
    <div className="container mx-auto py-20">
      <h2
        className="text-center font-semibold text-4xl"
        dangerouslySetInnerHTML={{ __html: t("title") }}
      />
      <div className="flex gap-6 mt-16">
        <div className="flex-1 bg-primary relative rounded-md">
          <Image
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            src="/step-3.png"
            width={350}
            height={0}
          />
        </div>
        <div className="flex-1 flex gap-8 flex-col">
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="rounded-full font-semibold text-xl"
            >
              1
            </Button>
            <div>
              <h2
                className="font-semibold mb-2 text-2xl"
                dangerouslySetInnerHTML={{ __html: t("step1.title") }}
              />
              <p
                className="text-muted-foreground text-2xl"
                dangerouslySetInnerHTML={{ __html: t("step1.description") }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="rounded-full font-semibold text-xl"
            >
              2
            </Button>
            <div>
              <h2
                className="font-semibold mb-2 text-2xl"
                dangerouslySetInnerHTML={{ __html: t("step2.title") }}
              />
              <p
                className="text-muted-foreground text-2xl"
                dangerouslySetInnerHTML={{ __html: t("step2.description") }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="rounded-full font-semibold text-xl"
            >
              3
            </Button>
            <div>
              <h2
                className="font-semibold mb-2 text-2xl"
                dangerouslySetInnerHTML={{ __html: t("step3.title") }}
              />
              <p
                className="text-muted-foreground text-2xl"
                dangerouslySetInnerHTML={{ __html: t("step3.description") }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;
