import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Discover from "./Discover";

const TopicTab = () => {
  return (
    <Tabs defaultValue="trending" className="mt-8">
      <div className="w-[500px]">
        <TabsList className="grid grid-cols-3 ">
          <TabsTrigger value="trending">{"Xu hướng"}</TabsTrigger>
          <TabsTrigger value="nearYou">{"Tổ chức phi lợi nhuận"}</TabsTrigger>
          <TabsTrigger value="nonprofits">{"Gần bạn"}</TabsTrigger>
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
