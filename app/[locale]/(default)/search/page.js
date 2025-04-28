"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import TopicTab from "./_components/topic-tab";

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
      <TopicTab />
    </div>
  );
};

export default SearchPage;
