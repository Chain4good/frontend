import { Button } from "@/components/ui/button";
import { ChartNoAxesCombined } from "lucide-react";
import React from "react";

const FundBox = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6">
      <div>
        <div>
          <h3 className="font-semibold text-2xl">$166,866 USD raised</h3>
          <div className="text-sm text-muted-foreground flex gap-2  items-center">
            <span>$185,000 goal</span>
            <span>·</span>
            <span>8.5K donations</span>
          </div>
        </div>
        <div></div>
      </div>
      <div className="flex gap-3 flex-col ">
        <Button variant={"secondary"} className="text-lg">
          Share
        </Button>
        <Button className="text-lg">Donate</Button>
      </div>
      <div className="flex gap-4 items-center">
        <span className="size-10 rounded-full bg-slate-200 flex items-center justify-center">
          <ChartNoAxesCombined size={18} />
        </span>
        <span className="text-primary font-semibold">
          536 people just donated
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <div className="flex gap-4 items-center">
          <img src="/images/heart.png" alt="heart" className="size-10" />
          <div className="flex flex-col">
            <h3 className="">Manh Cuong</h3>
            <p className="font-semibold">10$</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <img src="/images/heart.png" alt="heart" className="size-10" />
          <div className="flex flex-col">
            <h3 className="">Manh Cuong</h3>
            <p className="font-semibold">10$</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <img src="/images/heart.png" alt="heart" className="size-10" />
          <div className="flex flex-col">
            <h3 className="">Manh Cuong</h3>
            <p className="font-semibold">10$</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1">
          See all
        </Button>
        <Button variant="outline" className="flex-1">
          See top
        </Button>
      </div>
    </div>
  );
};

export default FundBox;
