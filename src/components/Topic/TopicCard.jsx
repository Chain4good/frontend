import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import * as motion from "motion/react-client";

const TopicCard = ({
  layout,
  image = "/Profiles_HP_Sm.png",
  title = "How to Help: Winter Storm Relief",
  description = "Winter storms have affected states across the country, leaving manywithout access to essentials. Donate to verified fundraisers now to help.",
}) => {
  if (layout === "horizontal") {
    return (
      <div className="grid grid-cols-2 w-full rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={image}
            className="w-full h-full aspect-video"
            alt="Profiles_HP_Sm"
          />
          <span className="absolute top-2 left-2 px-3 py-1 bg-blue-500 font-semibold text-sm opacity-80 rounded-full text-white">
            Urgent cause
          </span>
        </div>
        <div className="flex p-20 justify-center flex-col bg-background ">
          <h3 className="font-semibold text-xl mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          <motion.div whileTap={{ scale: 0.8 }} className="mt-8">
            <Button variant="ghost">
              Donate now <ChevronRight />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col w-full rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={image}
            className="w-full h-full aspect-video"
            alt="Profiles_HP_Sm"
          />
          <span className="absolute top-2 left-2 px-3 py-1 bg-blue-500 font-semibold text-sm opacity-80 rounded-full text-white">
            Urgent cause
          </span>
        </div>
        <div className="flex p-4 justify-center flex-col bg-background ">
          <h3 className="font-semibold text-xl mb-2">{title}</h3>
          {/* <p className="text-muted-foreground">{description}</p> */}
          <motion.div whileTap={{ scale: 0.8 }} className="mt-4">
            <Button variant="ghost">
              Donate now <ChevronRight />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
