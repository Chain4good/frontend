import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { NFT_RARITY } from "@/constants/nft";
import { resolveIPFSUrl } from "@/utils/ipfs";
import { motion } from "framer-motion";

const CongratulationModal = ({ open, onOpenChange, metadata }) => {
  useEffect(() => {
    if (open) {
      const colors = ["#00ff00", "#ff0000", "#0000ff"];

      // Pháo hoa từ giữa màn hình
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
      });

      // Pháo hoa từ 2 bên
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });

        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });
      }, 250);
    }
  }, [open]);

  if (!metadata) return null;

  // Lấy thông tin rarity từ attributes
  const rarityAttribute = metadata.attributes.find(
    (attr) => attr.trait_type === "Rarity"
  );
  const rarityInfo = Object.values(NFT_RARITY).find(
    (r) => r.label === rarityAttribute?.value
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle
            className="text-2xl font-semibold text-center pb-2"
            style={{ color: rarityInfo?.color }}
          >
            🎉 Chúc mừng! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src={resolveIPFSUrl(metadata.image)}
              alt={metadata.name}
              className="w-full rounded-lg shadow-lg"
            />
            <div
              className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: `${rarityInfo?.color}20`,
                color: rarityInfo?.color,
              }}
            >
              {rarityAttribute?.value}
            </div>
          </motion.div>

          <div className="space-y-2 text-center">
            <h3 className="font-semibold text-lg">{metadata.name}</h3>
            <p className="text-muted-foreground">{metadata.description}</p>
          </div>

          <Button onClick={() => onOpenChange(false)} className="w-full">
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CongratulationModal;
