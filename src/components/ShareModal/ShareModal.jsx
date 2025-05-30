import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Facebook, Link, Share } from "lucide-react";
import { toast } from "sonner";
import FacebookSvg from "../Icons/FacebookSvg";
import ZaloSvg from "../Icons/ZaloSvg";

const ShareModal = ({ campaign }) => {
  const shareUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Đã sao chép liên kết!");
    } catch (error) {
      toast.error("Không thể sao chép liên kết");
    }
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank");
  };

  const handleShareZalo = () => {
    const url = `https://zalo.me/share?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className="text-lg">
          <Share className="mr-2" /> Chia sẻ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ chiến dịch này</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Input readOnly value={shareUrl} className="flex-1" />
          <Button variant="secondary" onClick={handleCopyLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShareFacebook}
          >
            <FacebookSvg className="mr-2 h-8 w-8 text-blue-600" />
            Chia sẻ trên Facebook
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShareZalo}
          >
            <ZaloSvg />
            Chia sẻ trên Zalo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
