import Card from "@/components/Card/Card";
import React from "react";

const Discover = () => {
  return (
    <section className="py-10">
      <h2
        className="font-semibold mb-6 md:mb-10 text-2xl md:text-3xl text-center md:text-left"
        dangerouslySetInnerHTML={{
          __html:
            "Khám phá những người gây quỹ lấy cảm hứng từ những gì bạn quan tâm",
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Featured card - full width on mobile */}
        <Card className="col-span-1 md:col-span-1" />

        {/* Grid of smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
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
