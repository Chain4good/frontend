import React from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../ProgressBar/ProgressBar";
import { Badge } from "../ui/badge";
import { CampaignStatus } from "@/constants/status";
import { CheckCircle } from "lucide-react";
import { truncate } from "lodash";
const Card = ({ campaign, size, titleMaxLength }) => {
  const renderMedia = () => {
    if (campaign?.cover?.type === "VIDEO") {
      return (
        <video
          src={campaign?.cover?.url}
          className={`w-full h-56 object-cover ${
            size === "lg" ? "h-full" : "h-56 "
          }`}
          controls
          muted
        >
          <source src={campaign?.cover?.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <img
        src={campaign?.cover?.url}
        alt={campaign?.title}
        className={`w-full h-56 object-cover ${
          size === "lg" ? "h-full" : "h-56 "
        }`}
      />
    );
  };
  return (
    <Link to={`/fund/${campaign?.id}`} className="flex flex-col">
      <div className="relative rounded-lg flex-1 overflow-hidden">
        {renderMedia()}
        <span className="absolute left-2 bottom-2 px-4 py-1 bg-slate-900 bg-opacity-80 text-white rounded-full">
          {campaign?._count?.donations} Đóng góp
        </span>
        <Badge
          variant={campaign?.status === "ACTIVE" ? "secondary" : "default"}
          className="absolute top-4 right-4 flex gap-2 items-center"
        >
          {campaign?.status === "FINISHED" && <CheckCircle size={18} />}
          {CampaignStatus[campaign?.status]}
        </Badge>
      </div>
      <div className="p-1">
        <h3 className="font-semibold leading-none py-2" title={campaign?.title}>
          {truncate(campaign?.title, { length: titleMaxLength ?? 40 })}
        </h3>
        <p className="text-sm text-muted-foreground  mb-2">
          Tạo bởi {campaign?.user?.name}
        </p>
        <ProgressBar
          value={Number(campaign?.totalDonated)}
          max={Number(campaign?.ethGoal)}
        />
      </div>
    </Link>
  );
};

export default Card;
