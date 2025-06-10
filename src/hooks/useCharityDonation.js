import { useMemo } from "react";
import { ethers } from "ethers";
import CharityDonationABI from "../contracts/abi/CharityDonation.json";
import { updateCampaign } from "@/services/campaignService"; // Add this import

// const CONTRACT_ADDRESS = "0x02f0913C80fAab95154555f9Af6D97dD5e50B5b6";
const CONTRACT_ADDRESS = "0x704Ac006b88fC7FF3651cB8B1FC248CFF048Ad34";
// const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

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
        const amountInWei = ethers.parseEther(amountInEther);
        try {
          await contract.donate.staticCall(campaignId, amountInWei);
        } catch (error) {
          console.error("Static call revert reason:", error);
        }

        const tx = await contract.donate(campaignId, amountInWei, {
          value: amountInWei,
        });

        const receipt = await tx.wait();
        return {
          txHash: tx.hash,
          receipt: receipt,
        };
      },

      donateToken: async (campaignId, tokenAddress, amount, decimals = 18) => {
        try {
          console.log("Starting token donation:", {
            campaignId,
            tokenAddress,
            amount,
            decimals,
          });

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();

          // Get campaign info first to validate
          const contract = await getContract();
          const campaign = await contract.campaigns(campaignId);
          const campaignStatus = await contract.getCampaignStatus(campaignId);

          // Additional validation checks
          if (!campaignStatus.isActive) {
            throw new Error("Campaign is not active");
          }

          if (
            campaign.tokenAddress.toLowerCase() !== tokenAddress.toLowerCase()
          ) {
            throw new Error("Invalid token for this campaign");
          }

          const tokenContract = new ethers.Contract(
            tokenAddress,
            [
              "function approve(address spender, uint256 amount) public returns (bool)",
              "function allowance(address owner, address spender) public view returns (uint256)",
              "function balanceOf(address account) public view returns (uint256)",
              "function decimals() public view returns (uint8)",
              "function symbol() public view returns (string)",
            ],
            signer
          );

          const parsedAmount = ethers.parseUnits(amount.toString(), decimals);

          // Check balance first
          const balance = await tokenContract.balanceOf(userAddress);
          if (balance < parsedAmount) {
            throw new Error(
              `Insufficient token balance. Have: ${ethers.formatUnits(
                balance,
                decimals
              )}, Need: ${amount}`
            );
          }

          // Handle token approval
          const currentAllowance = await tokenContract.allowance(
            userAddress,
            CONTRACT_ADDRESS
          );
          if (currentAllowance < parsedAmount) {
            console.log("Approving tokens...");
            const maxApproval = ethers.MaxUint256; // Use maximum approval to avoid future approvals
            const approveTx = await tokenContract.approve(
              CONTRACT_ADDRESS,
              maxApproval
            );
            const approveReceipt = await approveTx.wait();
            if (!approveReceipt.status) {
              throw new Error("Token approval failed");
            }
            console.log("Token approval confirmed");
          }

          try {
            await contract.donate.staticCall(campaignId, amount);
          } catch (error) {
            console.error("Static call revert reason:", error);
          }

          // Skip gas estimation and use fixed gas limit
          console.log("Executing donation transaction...");
          const tx = await contract.donate(campaignId, parsedAmount, {
            gasLimit: 300000, // Fixed gas limit that should be sufficient
          });

          console.log("Waiting for confirmation...");
          const receipt = await tx.wait();

          if (!receipt.status) {
            throw new Error("Transaction failed");
          }

          return { txHash: tx.hash, receipt };
        } catch (error) {
          console.error("Donation error details:", error);

          if (error.code === "ACTION_REJECTED") {
            throw new Error("Transaction rejected by user");
          }

          if (error.message.includes("insufficient")) {
            throw new Error("Insufficient token balance");
          }

          if (error.message.includes("execution reverted")) {
            // Check campaign status again to give more specific error
            const contract = await getContract();
            const status = await contract.getCampaignStatus(campaignId);
            if (!status.isActive) {
              throw new Error("Campaign is no longer active");
            }
            throw new Error(
              "Transaction failed - please check campaign requirements"
            );
          }

          throw new Error(error.message || "Failed to process donation");
        }
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
      updateFeeRecipientUpdated: async () => {
        const contract = await getContract();
      },
      updateLendingPool: async (newLendingPool) => {
        try {
          if (!ethers.isAddress(newLendingPool)) {
            throw new Error("Invalid lending pool address");
          }

          const contract = await getContract();

          // Call the updateLendingPool function
          console.log("Updating lending pool to:", newLendingPool);
          const tx = await contract.updateLendingPool(newLendingPool);

          console.log("Waiting for transaction confirmation...");
          const receipt = await tx.wait();

          if (!receipt.status) {
            throw new Error("Transaction failed");
          }

          // Listen for the LendingPoolUpdated event
          const lendingPoolUpdatedFilter =
            contract.filters.LendingPoolUpdated();
          const events = await contract.queryFilter(
            lendingPoolUpdatedFilter,
            receipt.blockNumber,
            receipt.blockNumber
          );

          if (events.length > 0) {
            const event = events[0];
            console.log("Lending pool updated:", {
              oldPool: event.args.oldPool,
              newPool: event.args.newPool,
            });
          }

          return {
            txHash: tx.hash,
            receipt,
          };
        } catch (error) {
          console.error("Error updating lending pool:", error);

          if (error.code === "ACTION_REJECTED") {
            throw new Error("Transaction rejected by user");
          }

          throw new Error(error.message || "Failed to update lending pool");
        }
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
// Enhanced token validation
export const validateTokenDonation = async (
  tokenAddress,
  amount,
  decimals,
  contractAddress = CONTRACT_ADDRESS
) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  const tokenContract = new ethers.Contract(
    tokenAddress,
    [
      "function approve(address spender, uint256 amount) public returns (bool)",
      "function allowance(address owner, address spender) public view returns (uint256)",
      "function balanceOf(address account) public view returns (uint256)",
      "function decimals() public view returns (uint8)",
      "function symbol() public view returns (string)",
    ],
    signer
  );

  try {
    // Check if token contract is valid
    const symbol = await tokenContract.symbol();
    const tokenDecimals = await tokenContract.decimals();
    console.log("Token info:", { symbol, decimals: tokenDecimals });

    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);
    console.log("Parsed amount:", parsedAmount.toString());

    // Check balance
    const balance = await tokenContract.balanceOf(userAddress);
    console.log("Token balance:", balance.toString());

    if (balance < parsedAmount) {
      throw new Error(
        `Insufficient balance. Have: ${ethers.formatUnits(
          balance,
          decimals
        )}, Need: ${amount}`
      );
    }

    // Check allowance
    const allowance = await tokenContract.allowance(
      userAddress,
      contractAddress
    );
    console.log("Current allowance:", allowance.toString());

    if (allowance < parsedAmount) {
      console.log("Approving tokens...");
      const approveTx = await tokenContract.approve(
        contractAddress,
        parsedAmount
      );
      console.log("Approve tx:", approveTx.hash);
      await approveTx.wait();
      console.log("Approval confirmed");
    }

    return parsedAmount;
  } catch (error) {
    console.error("Token validation failed:", error);
    throw error;
  }
};
