import { useMemo } from "react";
import { ethers } from "ethers";
import CharityDonationABI from "../contracts/abi/CharityDonation.json";
import { updateCampaign } from "@/services/campaignService"; // Add this import

// const CONTRACT_ADDRESS = "0x02f0913C80fAab95154555f9Af6D97dD5e50B5b6";
// const CONTRACT_ADDRESS = "0xF5407c6152824f6D2b073e6cBc7e03D1CE6D54eA";
const CONTRACT_ADDRESS = "0xa0A6fB7ef8A68E24e6D0C400e5b731D80BAD97bD";
// 0xF5407c6152824f6D2b073e6cBc7e03D1CE6D54eA
// new: `0xa0A6fB7ef8A68E24e6D0C400e5b731D80BAD97bD`

export const TOKEN = {
  USDC: {
    address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    decimals: 6,
    symbol: "USDC",
    icon: "/icons/usdc.svg",
    tokenName: "usd-coin",
    description: "Đồng stablecoin được neo với USD",
    name: "USD Coin",
  },
  ETH: {
    address: ethers.ZeroAddress,
    decimals: 18,
    symbol: "ETH",
    icon: "/icons/eth.svg",
    tokenName: "ethereum",
    description: "Token gốc của mạng lưới Ethereum",
    name: "Ethereum",
  },
  USDT: {
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    decimals: 6,
    symbol: "USDT",
    tokenName: "tether",
    icon: "/icons/usdt.svg",
    description: "Đồng stablecoin được neo với USD",
    name: "Tether USD",
  },
  DAI: {
    address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
    decimals: 18,
    symbol: "DAI",
    tokenName: "dai",
    icon: "/icons/dai.svg",
    description: "Đồng stablecoin phi tập trung được neo với USD",
    name: "DAI Stablecoin",
  },
  LINK: {
    address: "0xf8Fb3713D459D7C1018BD0A49D19b4C44290EBE5",
    decimals: 18,
    symbol: "LINK",
    tokenName: "chainlink",
    icon: "/icons/chainlink.svg",
    description: "Token của mạng lưới Oracle phi tập trung",
    name: "Chainlink",
  },
};

export const useCharityDonation = () => {
  const getContract = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask chưa được cài đặt");
    }

    try {
      // Request account access explicitly
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(
        CONTRACT_ADDRESS,
        CharityDonationABI.abi,
        signer
      );
    } catch (error) {
      if (error.code === 4001) {
        throw new Error("Người dùng từ chối kết nối ví");
      }
      if (error.code === 4100) {
        throw new Error("Vui lòng kết nối ví MetaMask trước");
      }
      throw error;
    }
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
        try {
          const contract = await getContract();

          // Convert goal to BigNumber if it isn't already
          const goalBigNumber = ethers.getBigInt(goal.toString());

          // Convert duration to number
          const durationNumber = Number(duration);

          const tx = await contract.createCampaign(
            title,
            tokenAddress,
            goalBigNumber,
            durationNumber,
            isNoLimit
          );

          const receipt = await tx.wait();
          const count = await contract.campaignCount();

          // Convert BigInt to Number for chainCampaignId
          const chainCampaignId = Number(count) - 1;

          return {
            chainCampaignId,
            txHash: tx.hash,
          };
        } catch (error) {
          console.error("Create campaign error:", error);

          // Convert BigInt to string in error messages
          const errorMessage = error.message.replace(/BigInt\((.*?)\)/g, "$1");
          throw new Error(errorMessage);
        }
      },

      donateETH: async (campaignId, amountInEther) => {
        try {
          const contract = await getContract();
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();

          const balance = await provider.getBalance(userAddress);
          const amountInWei = ethers.parseEther(amountInEther);

          const feeData = await provider.getFeeData();
          const gasPrice = feeData.gasPrice;

          const gasLimit = await contract.donate.estimateGas(
            campaignId,
            amountInWei,
            {
              value: amountInWei,
            }
          );

          const gasCost = gasLimit * gasPrice;
          const totalCost = amountInWei + gasCost;

          if (balance < totalCost) {
            const requiredETH = ethers.formatEther(totalCost);
            const userETH = ethers.formatEther(balance);
            throw new Error(
              `Không đủ ETH. Cần: ${requiredETH} ETH (bao gồm phí gas), Có: ${userETH} ETH`
            );
          }

          const tx = await contract.donate(campaignId, amountInWei, {
            value: amountInWei,
            gasLimit: (gasLimit * BigInt(12)) / BigInt(10),
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

          // If allowance is insufficient, approve
          if (currentAllowance < parsedAmount) {
            const approveTx = await tokenContract.approve(
              CONTRACT_ADDRESS,
              parsedAmount
            );
            const approveReceipt = await approveTx.wait();

            if (!approveReceipt.status) {
              throw new Error("Token approval failed");
            }

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
          const tx = await contract.donate(campaignId, parsedAmount, {
            gasLimit: 300000,
          });

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

      // closeCampaign: async (campaignId) => {
      //   const contract = await getContract();
      //   const tx = await contract.closeCampaign(campaignId);
      //   await tx.wait();
      // },

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
      getCampaignCloseHistory: async (campaignId) => {
        try {
          const contract = await getContract();
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (!accounts || accounts.length === 0) {
            throw new Error("Vui lòng kết nối ví để xem thông tin này");
          }

          const history = await contract.getCampaignCloseHistory(campaignId);
          return {
            isClosed: history[0],
            closeReason: history[1],
            goalReached: history[2],
            totalRaised: history[3],
          };
        } catch (error) {
          console.error("Get campaign close history error:", error);
          throw error;
        }
      },

      getDonorInfo: async (campaignId, donorAddress) => {
        try {
          const contract = await getContract();
          const info = await contract.getDonorInfo(campaignId, donorAddress);
          return {
            totalAmount: info[0],
            donationCount: info[1],
            lastDonationTime: info[2],
          };
        } catch (error) {
          console.error("Get donor info error:", error);
          throw error;
        }
      },

      closeCampaign: async (campaignId) => {
        try {
          const contract = await getContract();
          const tx = await contract.closeCampaign(campaignId);
          const receipt = await tx.wait();
          return {
            txHash: tx.hash,
            receipt,
          };
        } catch (error) {
          console.error("Close campaign error:", error);
          if (error.code === "ACTION_REJECTED") {
            throw new Error("Người dùng từ chối giao dịch");
          }
          throw error;
        }
      },

      listenToCampaignClosed: async (campaignId, dbCampaignId) => {
        const contract = await getContract();

        contract.on("CampaignClosed", async (_campaignId, reachedGoal) => {
          console.log("CampaignClosed event:", {
            campaignId: Number(_campaignId),
            reachedGoal,
          });

          try {
            await updateCampaign(dbCampaignId, {
              status: reachedGoal ? "FINISHED" : "CANCELLED",
            });
          } catch (error) {
            console.error("Error updating campaign status:", error);
          }
        });

        return () => {
          contract.off("CampaignClosed");
        };
      },
      listenToDonationMade: async (campaignId, callback) => {
        const contract = await getContract();

        contract.on("DonationMade", async (_campaignId, donor, amount) => {
          console.log("DonationMade event:", {
            campaignId: Number(_campaignId),
            donor,
            amount: amount.toString(),
          });

          if (Number(_campaignId) === Number(campaignId) && callback) {
            callback();
          }
        });

        return () => {
          contract.off("DonationMade");
        };
      },
    }),

    []
  );
};
