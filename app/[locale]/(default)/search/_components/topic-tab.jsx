import { useTranslations } from "next-intl";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Discover from "@/app/[locale]/_components/discover/discover";

const TopicTab = () => {
  const t = useTranslations("Search");

  return (
    <Tabs defaultValue="trending" className="mt-8">
      <div className="w-[400px]">
        <TabsList className="grid grid-cols-3 ">
          <TabsTrigger value="trending">{t("tab.trending")}</TabsTrigger>
          <TabsTrigger value="nearYou">{t("tab.nearYou")}</TabsTrigger>
          <TabsTrigger value="nonprofits">{t("tab.nonprofits")}</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="trending">
        <Discover />
      </TabsContent>
      <TabsContent value="nearYou">
        <Discover />
      </TabsContent>
      <TabsContent value="nonprofits">
        <Discover />
      </TabsContent>
    </Tabs>
  );
};

export default TopicTab;
