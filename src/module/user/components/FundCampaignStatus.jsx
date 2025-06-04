import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CampaignStatus = ({ status }) => {
  const { isActive, isSuccessful, remainingTime } = status;

  const remainingDays = Math.floor(Number(remainingTime) / (24 * 60 * 60));

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 p-4 border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? (
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Đang hoạt động
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                Đã kết thúc
              </span>
            )}
          </Badge>

          {!isActive && (
            <Badge variant={isSuccessful ? "success" : "destructive"}>
              {isSuccessful ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" />
                  Thành công
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <XCircle className="h-3 w-3" />
                  Chưa đạt mục tiêu
                </span>
              )}
            </Badge>
          )}
        </div>

        {isActive && remainingDays > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Còn {remainingDays} ngày</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thời gian còn lại của chiến dịch</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default CampaignStatus;
