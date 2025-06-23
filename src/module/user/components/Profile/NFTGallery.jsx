import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { removeTrailingDot } from "@/lib/utils";
import { memo } from "react";

const NFTGallery = memo(({ nfts }) => {
  const getRarityVariant = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case "phổ biến":
        return "secondary";
      case "hiếm":
        return "blue";
      case "cực hiếm":
        return "destructive";
      case "huyền thoại":
        return "gold";
      default:
        return "outline";
    }
  };

  if (nfts?.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-muted p-3">
            <img
              src="/empty-nft.png"
              alt="No NFTs"
              className="w-12 h-12 opacity-50"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48'/%3E%3C/svg%3E";
              }}
            />
          </div>
          <h3 className="font-semibold text-lg">Chưa có NFT nào</h3>
          <p className="text-sm text-muted-foreground max-w-[300px]">
            Hãy quyên góp cho các chiến dịch để nhận NFT đặc biệt như một lời
            cảm ơn từ chúng tôi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {nfts.map((nft, index) => (
        <Card key={`${nft.tokenId}-${index}`}>
          <CardContent className="p-4">
            {nft.metadata?.image && (
              <img
                src={removeTrailingDot(nft.metadata.image)}
                alt={nft.metadata.name || `NFT ${index}`}
                className="aspect-square object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://ipfs.io/ipfs/bafybeibavb3eis6ny7g4ts5pvzybpt3jqcdr2v3leyoq63tsrydnd67lqi/20250618_2009_Kindness%20Cartoon%20NFT_simple_compose_01jy1jeem3f8kt7705x6yfdke0.png";
                  console.error("Error loading NFT image");
                }}
              />
            )}
            <h3 className="mt-2 font-semibold">{nft.metadata?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {nft.metadata?.description}
            </p>
            <p className="mt-2 text-xs text-muted-foreground break-all">
              Token ID: {nft.tokenId}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {nft.metadata?.attributes?.map((attr, idx) => (
                <Badge
                  key={idx}
                  variant={
                    attr.trait_type === "Rarity"
                      ? getRarityVariant(attr.value)
                      : "outline"
                  }
                >
                  {attr.trait_type === "Rarity" ? (
                    <span className="flex items-center gap-1">
                      <span>⭐</span> {attr.value}
                    </span>
                  ) : (
                    `${attr.trait_type}: ${attr.value}`
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

NFTGallery.displayName = "NFTGallery";

export default NFTGallery;
