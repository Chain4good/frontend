import { useMemo } from "react";
import { ethers } from "ethers";
import CharityDonationABI from "../contracts/abi/CharityDonation.json";
import { updateCampaign } from "@/services/campaignService"; // Add this import

// const CONTRACT_ADDRESS = "0x02f0913C80fAab95154555f9Af6D97dD5e50B5b6";
const CONTRACT_ADDRESS = "0xF5407c6152824f6D2b073e6cBc7e03D1CE6D54eA";
// 0xF5407c6152824f6D2b073e6cBc7e03D1CE6D54eA

export const TOKEN = {
  USDC: {
    address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    decimals: 6,
    symbol: "USDC",
    icon: "/icons/usdc.svg",
    tokenName: "usd-coin",
    description: "Stable coin pegged to USD",
    name: "USD Coin",
  },
  ETH: {
    address: ethers.ZeroAddress,
    decimals: 18,
    symbol: "ETH",
    icon: "/icons/eth.svg",
    tokenName: "ethereum",
    description: "Native token of Ethereum network",
    name: "Ethereum",
  },
  USDT: {
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    decimals: 6,
    symbol: "USDT",
    tokenName: "tether",
    icon: "/icons/usdt.svg",
    description: "Stable coin pegged to USD",
    name: "Tether USD",
  },
};

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
        try {
          const contract = await getContract();
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();

          // Check user's ETH balance first
          const balance = await provider.getBalance(userAddress);
          const amountInWei = ethers.parseEther(amountInEther);

          // Estimate gas
          const gasLimit = await contract.donate.estimateGas(
            campaignId,
            amountInWei,
            {
              value: amountInWei,
            }
          );
          const gasPrice = await provider.getGasPrice();
          const gasCost = gasLimit * gasPrice;

          // Calculate total cost (amount + gas)
          const totalCost = amountInWei + gasCost;

          // Check if user has enough ETH for amount + gas
          if (balance < totalCost) {
            const requiredETH = ethers.formatEther(totalCost);
            const userETH = ethers.formatEther(balance);
            throw new Error(
              `Không đủ ETH. Cần: ${requiredETH} ETH (bao gồm phí gas), Có: ${userETH} ETH`
            );
          }

          // Execute transaction with explicit gas settings
          const tx = await contract.donate(campaignId, amountInWei, {
            value: amountInWei,
            gasLimit: (gasLimit * BigInt(12)) / BigInt(10), // Add 20% buffer
            gasPrice,
          });

          const receipt = await tx.wait();
          return {
            txHash: tx.hash,
            receipt: receipt,
          };
        } catch (error) {
          console.error("Donation error:", error);

          if (error.code === "INSUFFICIENT_FUNDS") {
            throw new Error(
              "Không đủ ETH để thực hiện giao dịch (bao gồm phí gas)"
            );
          }

          throw error;
        }
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

          // Initialize token contract with full interface
          const tokenContract = new ethers.Contract(
            tokenAddress,
            [
              "function approve(address spender, uint256 amount) public returns (bool)",
              "function allowance(address owner, address spender) public view returns (uint256)",
              "function balanceOf(address account) public view returns (uint256)",
              "function decimals() public view returns (uint8)",
            ],
            signer
          );

          // Verify token decimals
          const actualDecimals = await tokenContract.decimals();
          if (actualDecimals !== decimals) {
            console.warn(
              `Token decimals mismatch. Expected: ${decimals}, Actual: ${actualDecimals}`
            );
            decimals = actualDecimals;
          }

          const parsedAmount = ethers.parseUnits(amount.toString(), decimals);

          // Check token balance
          const balance = await tokenContract.balanceOf(userAddress);
          if (balance < parsedAmount) {
            throw new Error(
              `Không đủ token. Có: ${ethers.formatUnits(
                balance,
                decimals
              )}, Cần: ${amount}`
            );
          }

          // Check current allowance
          const currentAllowance = await tokenContract.allowance(
            userAddress,
            CONTRACT_ADDRESS
          );
          console.log(
            "Current allowance:",
            ethers.formatUnits(currentAllowance, decimals)
          );

          // If allowance is insufficient, approve
          if (currentAllowance < parsedAmount) {
            console.log("Approving tokens...");
            const approveTx = await tokenContract.approve(
              CONTRACT_ADDRESS,
              parsedAmount
            );
            const approveReceipt = await approveTx.wait();

            if (!approveReceipt.status) {
              throw new Error("Token approval failed");
            }
            console.log("Token approval confirmed:", approveReceipt.hash);

            // Verify the new allowance
            const newAllowance = await tokenContract.allowance(
              userAddress,
              CONTRACT_ADDRESS
            );
            if (newAllowance < parsedAmount) {
              throw new Error("Token approval was not successful");
            }
          }

          // Execute donation
          const contract = await getContract();
          console.log("Executing donation...");
          const tx = await contract.donate(campaignId, parsedAmount, {
            gasLimit: 300000, // Set explicit gas limit
          });

          console.log("Waiting for confirmation...");
          const receipt = await tx.wait();

          if (!receipt.status) {
            throw new Error("Donation transaction failed");
          }

          return {
            txHash: tx.hash,
            receipt: receipt,
          };
        } catch (error) {
          console.error("Token donation error:", error);

          if (error.code === "ACTION_REJECTED") {
            throw new Error("Người dùng từ chối giao dịch");
          }

          if (error.message.includes("allowance")) {
            throw new Error("Cần phê duyệt token - vui lòng thử lại");
          }

          if (error.message.includes("insufficient")) {
            throw new Error("Số dư token không đủ");
          }

          throw new Error(error.message || "Quyên góp token thất bại");
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
