import React from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../ProgressBar/ProgressBar";
import { Badge } from "../ui/badge";
import { CampaignStatus } from "@/constants/status";
import { CheckCircle } from "lucide-react";
const Card = ({ campaign }) => {
  const renderMedia = () => {
    if (campaign?.cover?.type === "VIDEO") {
      return (
        <video
          src={campaign?.cover?.url}
          className="w-full h-48 object-cover"
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
        className="w-full h-48 object-cover"
      />
    );
  };
  return (
    <Link to={`/fund/${campaign?.id}`} className="flex flex-col">
      <div className="relative rounded-lg flex-1 overflow-hidden">
        {renderMedia()}
        <span className="absolute left-2 bottom-2 px-4 py-1 bg-slate-900 bg-opacity-80 text-white rounded-full">
          1k donations
        </span>
        <Badge
          variant={campaign?.status === "ACTIVE" ? "secondary" : "default"}
          className="absolute top-4 right-4 flex gap-2 items-center"
        >
          {campaign?.status === "FINISHED" && <CheckCircle size={18} />}
          {CampaignStatus[campaign?.status]}
        </Badge>
      </div>
      <div>
        <h3 className="font-semibold leading-none p-2 mb-1">
          {campaign?.title}
        </h3>
        <ProgressBar value={123000} max={200000} />
      </div>
    </Link>
  );
};

export default Card;
