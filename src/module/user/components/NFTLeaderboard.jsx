import { useCharityHearts } from "@/hooks/useNFTContract";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const NFTLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(null);
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

  if (!leaderboard) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 container">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bảng xếp hạng NFT</h2>
          <Badge variant="outline">Top {leaderboard.length}</Badge>
        </div>

        <div className="divide-y">
          {leaderboard.map((item, index) => (
            <div
              key={item.address}
              className="flex items-center justify-between py-4 hover:bg-muted/50 rounded-lg px-4 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index)}
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-sm">{item.shortAddress}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Holding: {item.count}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Minted: {item.totalMinted}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold text-primary">
                  {item.count}
                </span>
                <span className="text-sm text-muted-foreground ml-1">NFTs</span>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có dữ liệu.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
