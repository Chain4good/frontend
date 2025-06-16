import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

const FundCreator = ({ campaign, onChainCampaign }) => {
  return (
    <div className="flex gap-3 md:gap-4 items-center mt-4 pb-4">
      <div className="relative">
        <Avatar className="h-8 w-8 md:h-10 md:w-10">
          <AvatarImage src={campaign?.user?.image} />
          <AvatarFallback>CG</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 flex">
          {campaign?.user?.UserBadge?.map((userBadge, index) => (
            <TooltipProvider key={userBadge.badge.id}>
              <Tooltip content={userBadge.badge.description}>
                <img
                  src={userBadge.badge.iconUrl}
                  alt={userBadge.badge.name}
                  className="w-4 h-4 md:w-5 md:h-5"
                  style={{ marginLeft: index > 0 ? "-6px" : "0" }}
                />
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm md:text-base">
          <strong>{campaign?.user?.name}</strong> đang tổ chức buổi gây quỹ
        </div>
        <p className="text-muted-foreground text-xs md:text-sm">
          {onChainCampaign?.creator}
        </p>
      </div>
    </div>
  );
};

export default FundCreator;
