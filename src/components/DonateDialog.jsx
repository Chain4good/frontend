import { useCharityDonation } from "@/hooks/useCharityDonation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DonateDialog = ({ campaignId }) => {
  const { donateToken } = useCharityDonation();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDonate = async () => {
    try {
      setIsLoading(true);

      // USDC token address on Ethereum
      const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

      await donateToken(
        campaignId,
        USDC_ADDRESS,
        amount,
        6 // USDC has 6 decimals
      );

      toast.success("Quyên góp thành công!");
      setAmount("");
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Không thể quyên góp: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Nhập số lượng token..."
        disabled={isLoading}
      />
      <Button
        onClick={handleDonate}
        disabled={!amount || isLoading}
        className="w-full"
      >
        {isLoading ? "Đang xử lý..." : "Quyên góp"}
      </Button>
    </div>
  );
};

export default DonateDialog;
