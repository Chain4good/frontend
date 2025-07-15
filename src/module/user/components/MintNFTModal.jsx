import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCharityHearts } from "@/hooks/useNFTContract";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CongratulationModal from "@/components/CongratulationModal";
import { resolveIPFSUrl } from "@/utils/ipfs";
import { NFT_RARITY } from "@/constants/nft";
import { Skeleton } from "@/components/ui/skeleton"; // Thêm import này

const MintNFTModal = ({ open, onOpenChange, metadata, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { mintNFT } = useCharityHearts();

  const handleMint = async () => {
    try {
      setIsLoading(true);
      await mintNFT(metadata);
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
      setShowCongrats(true);
      toast.success("Mint NFT thành công!");
    } catch (error) {
      console.error("Mint NFT error:", error);
      toast.error("Mint NFT thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy thông tin rarity từ metadata
  const rarityAttribute = metadata?.attributes?.find(
    (attr) => attr.trait_type === "Rarity"
  );
  const rarityInfo = Object.values(NFT_RARITY).find(
    (r) => r.label === rarityAttribute?.value
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center pb-2">
              Mint NFT Xác Nhận Quyên Góp
            </DialogTitle>
            <p className="text-center text-muted-foreground">
              Bạn có muốn mint NFT để lưu lại dấu ấn quyên góp của lần này
              không?
            </p>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Preview NFT */}
            {metadata && (
              <div className="space-y-4">
                <div className="relative">
                  {imageLoading && (
                    <Skeleton className="w-full aspect-square rounded-xl absolute inset-0" />
                  )}
                  <img
                    src={resolveIPFSUrl(metadata.image)}
                    alt={metadata.name}
                    className={`w-full aspect-square object-cover rounded-xl ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setImageLoading(false)}
                  />
                  <div
                    className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${rarityInfo?.color}20`,
                      color: rarityInfo?.color,
                    }}
                  >
                    {rarityAttribute?.value}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-lg text-center">
                    {metadata.name}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {metadata.description}
                  </p>
                </div>
              </div>
            )}

            {/* Chi phí mint */}
            <div className="p-4 rounded-lg border bg-muted space-y-2">
              <p className="text-sm font-medium text-center">
                Chi phí mint NFT
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Phí gas (ước tính)
                </span>
                <span className="font-medium">~0.001 - 0.003 ETH</span>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                *Chi phí có thể thay đổi tùy thuộc vào tình trạng mạng lưới
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Để sau
              </Button>
              <Button
                className="flex-1"
                onClick={handleMint}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  "Mint NFT"
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Bằng cách mint NFT, bạn sẽ phải trả phí gas của mạng lưới
              Ethereum. Đảm bảo bạn có đủ ETH trong ví để thực hiện giao dịch.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <CongratulationModal
        open={showCongrats}
        onOpenChange={setShowCongrats}
        metadata={metadata}
      />
    </>
  );
};

export default MintNFTModal;
