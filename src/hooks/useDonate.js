import { useState } from "react";
import { useCharityDonation } from "./useCharityDonation";
import { generateNFTMetadata } from "@/utils/nft";
import { createDonation } from "@/services/donationService";
import { TOKEN } from "./useCharityDonation";

export const useDonate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { donateETH, donateToken } = useCharityDonation();

  const donate = async (params) => {
    const { campaign, amount, selectedToken, user } = params;

    if (!amount || Number(amount) <= 0) {
      throw new Error("Vui lòng nhập số tiền hợp lệ");
    }

    if (!user) {
      throw new Error("Vui lòng đăng nhập để sử dụng chức năng");
    }

    try {
      setIsLoading(true);
      let txHash;

      if (selectedToken === "ETH") {
        const result = await donateETH(
          campaign.chainCampaignId,
          amount.toString()
        );
        txHash = result.txHash;

        await createDonation({
          campaignId: campaign.id,
          amount: Number(amount),
          txHash: txHash,
          token: "ETH",
          tokenName: "ethereum",
        });
      } else {
        const token = TOKEN[selectedToken];
        const result = await donateToken(
          campaign.chainCampaignId,
          token.address,
          amount.toString(),
          token.decimals
        );
        txHash = result.txHash;

        await createDonation({
          campaignId: campaign.id,
          amount: Number(amount),
          txHash: txHash,
          token: selectedToken,
          tokenName: token.tokenName,
        });
      }

      const metadata = generateNFTMetadata(user?.name || user?.email, amount);
      return { txHash, metadata };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    donate,
    isLoading,
  };
};
