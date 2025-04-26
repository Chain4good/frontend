import React from "react";
import FundBox from "./_components/fund-box/fund-box";
import ReadMore from "@/components/read-more/read-more";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ShareModal from "./_components/share-modal/share-modal";

const FundPage = () => {
  return (
    <div className="container mt-20  py-10 ">
      <h1 className="text-4xl font-semibold pb-6">
        Deonte's Journey to Mobility Freedom
      </h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 ">
          <img
            className="rounded-lg shadow-md w-full h-96 object-cover"
            src="https://images.gofundme.com/HuszMnzFNkagUzpLh3SuJIF2JXY=/720x405/https://d2g8igdw686xgo.cloudfront.net/85835387_1737439244236101_r.jpeg"
          />
          <div className="flex gap-4 items-center mt-4 pb-4">
            <img
              className="size-10 rounded-full overflow-hidden  object-cover"
              src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRYMrdBYilyP2xRrEvliz4I1frGlBP8RIGh06TwuDrQ2PV120_3u7Fv8XaZv_DxKl1FvLWuD33muXovcfo"
            />
            <div>
              Deonte Scott is organizing this fundraiser on behalf of Deasia
              Scott.
            </div>
          </div>
          <Separator />
          <ReadMore
            className="text-lg mt-6"
            text="Hello, my name is Deonte. I was born with spastic cerebral palsy, which means I rely on a wheelchair for mobility. Getting around is difficult, and I depend on wheelchair vans or cabs just to leave the house. The problem is, wheelchair cabs are too expensive, and I can’t afford them regularly.
                Every day, I wish on a million stars that I could have my own wheelchair-accessible van. With your help, that wish can come true.
                I’ve set a goal of **$185,000** because wheelchair-accessible vans are extremely expensive. A reliable, fully customized van that meets all my needs—including a ramp, hand controls, and other modifications—can cost well over $80,000. On top of that, I need to cover additional expenses such as insurance, registration, and maintenance to keep the van in good condition for years to come. This goal will ensure I can afford a safe, dependable vehicle that gives me the freedom to get around on my own.
                My sister is helping me by managing the funds, and all donations will go into her bank account. Please know that this is still my money, and it will be used exclusively for my wheelchair-accessible van.
                I want to express my deep gratitude to each and every one of you who has donated and will continue to support this cause.
                Any donation, no matter how small, will bring me closer to making this dream a reality. Even if you can’t donate, sharing this fundraiser would mean the world to me.
                Thanks to your generosity, I will also be able to pay for insurance months in advance.
                Thank you all again for your kindness and support! - Had to make changes to the goal to include extra expenses
                This will go towards hiring a driver and extra expenses for if the vehicle brakes down
                — Deonte"
          />
          <div className="flex gap-4 items-center mt-4 pb-6">
            <Button
              variant="outline"
              size="lg"
              className="font-semibold flex-1 text-lg"
            >
              Donate
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-semibold flex-1 text-lg"
            >
              Share
            </Button>
          </div>
          <Separator />
        </div>
        <div className="col-span-1">
          <FundBox />
        </div>
      </div>
      <ShareModal />
    </div>
  );
};

export default FundPage;
