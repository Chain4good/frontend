import { Button } from "@/components/ui/button";
import { truncate } from "lodash";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const TopicCard = ({ layout, post }) => {
  const [contentLength, setContentLength] = useState(100);

  useEffect(() => {
    const handleResize = () => {
      setContentLength(window.innerWidth < 768 ? 80 : 100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (layout === "horizontal") {
    return (
      <Link
        to={`/post/${post?.slug}`}
        className="flex flex-col md:grid md:grid-cols-2 w-full rounded-lg overflow-hidden"
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
        <div className="flex p-6 md:p-12 lg:p-20 justify-center flex-col bg-background">
          <h3 className="font-semibold text-lg md:text-xl mb-2">
            {post?.title}
          </h3>
          <div
            className="text-muted-foreground text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: truncate(post?.content, { length: contentLength }),
            }}
          ></div>
          <div className="mt-6 md:mt-8">
            <Button variant="ghost" className="text-sm md:text-base">
              Chi tiết <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
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
            className="w-full h-full aspect-video object-cover"
            alt="Profiles_HP_Sm"
          />
          <span className="absolute top-2 left-2 px-3 py-1 bg-blue-500 font-semibold text-sm opacity-80 rounded-full text-white">
            {post?.topic?.name}
          </span>
        </div>
        <div className="flex p-4 md:p-6 justify-center flex-col bg-background">
          <h3 className="font-semibold text-lg md:text-xl mb-2">
            {truncate(post?.title, { length: 30 })}
          </h3>
          <div
            className="text-muted-foreground text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: truncate(post?.content, { length: 50 }),
            }}
          ></div>
          <div className="mt-4 md:mt-6">
            <Button variant="ghost" className="text-sm md:text-base">
              Chi tiết <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;
