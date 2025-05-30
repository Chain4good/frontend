import { useMemo } from "react";
import { ethers } from "ethers";
import CharityDonationABI from "../contracts/abi/CharityDonation.json";
import { updateCampaign } from "@/services/campaignService"; // Add this import

const CONTRACT_ADDRESS = "0x02f0913C80fAab95154555f9Af6D97dD5e50B5b6";

export const useCharityDonation = () => {
  const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not installed");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      CharityDonationABI.abi,
      signer
    );
  };

  return useMemo(
    () => ({
      createCampaign: async (
        title,
        tokenAddress,
        goal,
        duration,
        isNoLimit
      ) => {
        const contract = await getContract();
        const tx = await contract.createCampaign(
          title,
          tokenAddress,
          goal,
          duration,
          isNoLimit
        );
        const receipt = await tx.wait();
        const count = await contract.campaignCount();
        const chainCampaignId = Number(count) - 1; // 🔥

        return {
          chainCampaignId,
          txHash: tx.hash,
        };
      },

      donateETH: async (campaignId, amountInEther) => {
        const contract = await getContract();
        const tx = await contract.donate(
          campaignId,
          ethers.parseEther(amountInEther.toString()),
          {
            value: ethers.parseEther(amountInEther.toString()),
          }
        );
        const receipt = await tx.wait();
        return {
          txHash: tx.hash,
          receipt: receipt,
        };
      },

      donateToken: async (campaignId, tokenAddress, amount, decimals = 18) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(); // ✅ await signer

        const tokenContract = new ethers.Contract(
          tokenAddress,
          [
            "function approve(address spender, uint256 amount) public returns (bool)",
            "function allowance(address owner, address spender) public view returns (uint256)",
          ],
          signer
        );

        const parsedAmount = ethers.parseUnits(amount.toString(), decimals);
        await tokenContract.approve(CONTRACT_ADDRESS, parsedAmount);

        const contract = await getContract();
        const tx = await contract.donate(campaignId, parsedAmount);
        await tx.wait();
      },

      closeCampaign: async (campaignId) => {
        const contract = await getContract();
        const tx = await contract.closeCampaign(campaignId);
        await tx.wait();
      },

      refund: async (campaignId) => {
        const contract = await getContract();
        const tx = await contract.refund(campaignId);
        await tx.wait();
      },

      getDonors: async (campaignId) => {
        const contract = await getContract();
        return await contract.getDonors(campaignId);
      },

      getCampaignStatus: async (campaignId) => {
        const contract = await getContract();
        return await contract.getCampaignStatus(campaignId);
      },

      getCampaign: async (campaignId) => {
        const contract = await getContract();
        return await contract.campaigns(campaignId);
      },

      getCampaignCount: async () => {
        const contract = await getContract();
        return await contract.campaignCount();
      },

      listenToFundsWithdrawn: async (campaignId, dbCampaignId) => {
        const contract = await getContract();

        contract.on("FundsWithdrawn", async (campaignId, creator, amount) => {
          console.log("FundsWithdrawn event:", {
            campaignId: Number(campaignId),
            creator,
            amount: amount.toString(),
          });

          try {
            await updateCampaign(dbCampaignId, {
              status: "FINISHED",
            });
          } catch (error) {
            console.error("Error updating campaign status:", error);
          }
        });

        return () => {
          contract.off("FundsWithdrawn");
        };
      },
    }),
    []
  );
};
