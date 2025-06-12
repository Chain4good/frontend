import React from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../ProgressBar/ProgressBar";
import { Badge } from "../ui/badge";
import {
  CampaignStatus,
  CampaignStatusColors,
  CampaignStatusLabel,
} from "@/constants/status";
import { CheckCircle } from "lucide-react";
import { truncate } from "lodash";
import { TOKEN } from "@/hooks/useCharityDonation"; // Thêm import TOKEN

const Card = ({ campaign, size, titleMaxLength }) => {
  // Thêm hàm để lấy token info
  const getTokenInfo = (tokenAddress) => {
    if (!tokenAddress) return null;

    const matchingToken = Object.entries(TOKEN).find(
      ([_, token]) =>
        token.address.toLowerCase() === tokenAddress?.toLowerCase()
    );

    return matchingToken ? matchingToken[1] : null;
  };

  const tokenInfo = getTokenInfo(campaign?.tokenAddress);

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
        <span className="absolute left-2 bottom-2 px-4 py-1 bg-slate-900 bg-opacity-80 text-white rounded-full flex items-center gap-2">
          {tokenInfo && (
            <img
              src={tokenInfo.icon}
              alt={tokenInfo.symbol}
              className="w-4 h-4"
            />
          )}
          {campaign?._count?.donations} Đóng góp
        </span>
        <Badge
          // variant={campaign?.status === "ACTIVE" ? "secondary" : "default"}
          className="absolute top-4 right-4 flex gap-2 items-center"
          style={{
            backgroundColor: CampaignStatusColors[campaign?.status],
          }}
        >
          {campaign?.status === "FINISHED" && <CheckCircle size={18} />}
          {CampaignStatusLabel[campaign?.status]}
        </Badge>
      </div>
      <div className="p-1">
        <h3 className="font-semibold leading-none py-2" title={campaign?.title}>
          {truncate(campaign?.title, { length: titleMaxLength ?? 40 })}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          Tạo bởi {campaign?.user?.name}
        </p>
        <div className="flex items-center gap-2 mb-2">
          {tokenInfo && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <img
                src={tokenInfo.icon}
                alt={tokenInfo.symbol}
                className="w-4 h-4"
              />
              <span>{tokenInfo.symbol}</span>
            </div>
          )}
        </div>
        <ProgressBar
          value={Number(campaign?.totalDonated)}
          max={Number(campaign?.tokenGoal)}
          symbol={campaign?.tokenSymbol}
        />
      </div>
    </Link>
  );
};

export default Card;
