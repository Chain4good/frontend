import { Button } from "@/components/ui/button";
import { truncate } from "lodash";
import { ChevronRight } from "lucide-react";
import * as motion from "motion/react-client";
import { Link } from "react-router-dom";

const TopicCard = ({
  layout,
  post,
  image = "/Profiles_HP_Sm.png",
  title = "How to Help: Winter Storm Relief",
  description = "Winter storms have affected states across the country, leaving manywithout access to essentials. Donate to verified fundraisers now to help.",
}) => {
  if (layout === "horizontal") {
    return (
      <Link
        to={`/post/${post?.slug}`}
        className="grid grid-cols-2 w-full rounded-lg overflow-hidden"
      >
        <div className="relative">
          <img
            src={post?.thumbnail}
            className="w-full h-full aspect-video object-cover"
            alt="Profiles_HP_Sm"
          />
          <span className="absolute top-2 left-2 px-3 py-1 bg-blue-500 font-semibold text-sm opacity-80 rounded-full text-white">
            {post?.topic?.name}
          </span>
        </div>
        <div className="flex p-20 justify-center flex-col bg-background ">
          <h3 className="font-semibold text-xl mb-2">{post?.title}</h3>
          <div
            className="text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: truncate(post?.content, { length: 100 }),
            }}
          ></div>
          <motion.div whileTap={{ scale: 0.8 }} className="mt-8">
            <Button variant="ghost">
              Chi tiết <ChevronRight />
            </Button>
          </motion.div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post?.slug}`}>
      <div className="flex flex-col w-full rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={post?.thumbnail}
            className="w-full h-full aspect-video"
            alt="Profiles_HP_Sm"
          />
          <span className="absolute top-2 left-2 px-3 py-1 bg-blue-500 font-semibold text-sm opacity-80 rounded-full text-white">
            {post?.topic?.name}
          </span>
        </div>
        <div className="flex p-4 justify-center flex-col bg-background ">
          <h3 className="font-semibold text-xl mb-2">
            {truncate(post?.title, { length: 30 })}
          </h3>
          <div
            className="text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: truncate(post?.content, { length: 50 }),
            }}
          ></div>
          <motion.div whileTap={{ scale: 0.8 }} className="mt-4">
            <Button variant="ghost">
              Chi tiết <ChevronRight />
            </Button>
          </motion.div>
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;
