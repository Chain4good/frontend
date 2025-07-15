import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Trophy, Medal, Award } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

const TopDonorsModal = ({ open, onOpenChange, donors = [] }) => {
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const sortedDonors = [...donors]
    .sort((a, b) => b.totalAmount.raw - a.totalAmount.raw)
    .slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center pb-2">
            Top 10 Nhà Hảo Tâm
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {sortedDonors.map((donor, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={donor.address}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-all"
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index) || (
                  <span className="text-lg font-semibold text-muted-foreground">
                    #{index + 1}
                  </span>
                )}
              </div>
              {/* <Avatar>
                <AvatarImage src="/charity.png" alt="Charity" />
                <AvatarFallback>
                  {donor.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar> */}
              <div className="flex-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        to={`https://sepolia.etherscan.io/address/${donor.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary font-mono "
                      >
                        {donor.short}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>{donor.address}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">
                    {donor.totalAmount.formatted} {donor.totalAmount.symbol}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    · {donor.donationCount} lần quyên góp
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopDonorsModal;
