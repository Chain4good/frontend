"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import Discover from "../_components/discover/discover";

const SearchPage = () => {
  const t = useTranslations("Search");
  return (
    <div className="pt-20 container">
      <div className="py-10 flex flex-col items-center gap-3">
        <h1
          className="title-lg"
          dangerouslySetInnerHTML={{ __html: t("title") }}
        />
        <p
          className="text-lg text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: t("description") }}
        />
      </div>
      <div className="flex justify-center">
        <div className="flex md:w-[460px] bg-primary/10 border border-separate rounded-full px-2 py-1 w-[200px] items-center justify-center">
          <Search />
          <Input
            placeholder={t("placeholder")}
            className="outline-none text-lg bg-transparent border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

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
    </div>
  );
};

export default SearchPage;
