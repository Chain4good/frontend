import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCharityHearts } from "@/hooks/useNFTContract";
import { Award, Medal, Trophy, Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 10;

const NFTs = () => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { getNFTLeaderboard } = useCharityHearts();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNFTLeaderboard();
      setLeaderboard(response);
    };
    fetchData();
  }, [getNFTLeaderboard]);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="font-bold text-muted-foreground">#{index + 1}</span>
        );
    }
  };

  const paginatedLeaderboard = leaderboard?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil((leaderboard?.length || 0) / ITEMS_PER_PAGE);

  if (!leaderboard) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px] animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full animate-pulse" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-8 container max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Bảng xếp hạng NFT
          </h2>
          <Badge variant="secondary" className="px-4 py-1">
            {leaderboard.length} người dùng
          </Badge>
        </div>

        <div className="space-y-2">
          {paginatedLeaderboard.map((item, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              key={item.address}
              className="group relative bg-card hover:bg-accent rounded-lg p-4 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    {getRankIcon(index)}
                  </div>
                  <div className="space-y-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <p className="font-mono text-sm flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                            {item.shortAddress}
                            <Info className="h-3.5 w-3.5" />
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{item.address}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex gap-3">
                      <span className="text-sm text-muted-foreground">
                        Đang giữ: {item.count}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Đã mint: {item.totalMinted}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-semibold">{item.count}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    NFTs
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboard.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-md transition-colors ${
                  currentPage === i + 1
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {leaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <p>Chưa có dữ liệu.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default NFTs;
