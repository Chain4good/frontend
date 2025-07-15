import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmMintModal = ({ open, onOpenChange, onConfirm, onDecline }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center pb-2">
            Xác nhận mint NFT
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Bạn có muốn mint NFT để lưu lại dấu ấn quyên góp này không?
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <p className="text-sm text-center">
            NFT sẽ là bằng chứng cho sự đóng góp của bạn trong chiến dịch này
          </p>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={onDecline}>
              Không, cảm ơn
            </Button>
            <Button className="flex-1" onClick={onConfirm}>
              Mint NFT
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmMintModal;
