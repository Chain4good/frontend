import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { HandHeart, Loader2 } from "lucide-react";
import { toast } from "sonner";

const FundBoxDonateDialog = ({
  onChainCampaign,
  progress,
  onDonate,
  isLoading,
}) => {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      await onDonate(amount, selectedToken);
      setOpen(false);
      setAmount("");
    } catch (error) {
      console.error("Donation error:", error);
    }
  };

  const getMaxAmount = () => {
    if (!onChainCampaign?.goal || onChainCampaign.isNoLimit) return Infinity;
    const remaining =
      Number(onChainCampaign.goal.eth) -
      Number(onChainCampaign.totalDonated.eth);
    return remaining > 0 ? remaining : 0;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="text-lg font-medium">
          <HandHeart className="mr-2 h-5 w-5" /> Quyên góp
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quyên góp cho chiến dịch</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="token" className="text-right">
              Token
            </Label>
            <Select
              value={selectedToken}
              onValueChange={setSelectedToken}
              disabled={isLoading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="WETH">WETH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Số lượng
            </Label>
            <div className="col-span-3">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) >= 0) {
                    setAmount(value);
                  }
                }}
                placeholder={`Tối đa ${getMaxAmount()} ${selectedToken}`}
                disabled={isLoading}
                step="0.000001"
                min="0"
                max={getMaxAmount()}
              />
            </div>
          </div>

          {progress >= 100 && !onChainCampaign?.isNoLimit && (
            <p className="text-sm text-red-500 col-span-4 text-center">
              Chiến dịch đã đạt mục tiêu
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !amount ||
              Number(amount) <= 0 ||
              (!onChainCampaign?.isNoLimit && progress >= 100)
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FundBoxDonateDialog;
