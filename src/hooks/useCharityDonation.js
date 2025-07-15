import { useMemo, useCallback } from "react";
import { ethers } from "ethers";
import CharityDonationABI from "../contracts/abi/CharityDonation.json";
import { updateCampaign } from "@/services/campaignService";

const CONTRACT_ADDRESS = "0xa0A6fB7ef8A68E24e6D0C400e5b731D80BAD97bD";

// Constants for better maintainability
const GAS_LIMIT_MULTIPLIER = 1.2; // 20% buffer
const DEFAULT_GAS_LIMIT = 300000;

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

// Error messages for better maintainability
const ERROR_MESSAGES = {
  NO_METAMASK: "MetaMask chưa được cài đặt",
  USER_REJECTED: "Người dùng từ chối kết nối ví",
  WALLET_NOT_CONNECTED: "Vui lòng kết nối ví MetaMask trước",
  INSUFFICIENT_FUNDS: "Không đủ ETH để thực hiện giao dịch (bao gồm phí gas)",
  TRANSACTION_REJECTED: "Người dùng từ chối giao dịch",
  INSUFFICIENT_TOKEN: "Số dư token không đủ",
  APPROVAL_FAILED: "Token approval thất bại",
  NEED_APPROVAL: "Cần phê duyệt token - vui lòng thử lại",
};

export const useCharityDonation = () => {
  // Memoized contract getter with better error handling
  const getContract = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error(ERROR_MESSAGES.NO_METAMASK);
    }

    try {
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
        throw new Error(ERROR_MESSAGES.USER_REJECTED);
      }
      if (error.code === 4100) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      }
      throw error;
    }
  }, []);

  // Helper function for gas estimation
  const estimateGasWithBuffer = useCallback(
    async (contract, method, params, overrides = {}) => {
      try {
        const gasEstimate = await contract[method].estimateGas(
          ...params,
          overrides
        );
        return (
          (gasEstimate * BigInt(Math.floor(GAS_LIMIT_MULTIPLIER * 10))) /
          BigInt(10)
        );
      } catch (error) {
        console.warn("Gas estimation failed, using default:", error);
        return BigInt(DEFAULT_GAS_LIMIT);
      }
    },
    []
  );

  // Helper function to handle BigInt serialization
  const sanitizeErrorMessage = useCallback((message) => {
    return message.replace(/BigInt\((.*?)\)/g, "$1");
  }, []);

  // Optimized campaign creation
  const createCampaign = useCallback(
    async (title, tokenAddress, goal, duration, isNoLimit) => {
      try {
        const contract = await getContract();

        const goalBigNumber = ethers.getBigInt(goal.toString());
        const durationNumber = Number(duration);

        const gasLimit = await estimateGasWithBuffer(
          contract,
          "createCampaign",
          [title, tokenAddress, goalBigNumber, durationNumber, isNoLimit]
        );

        const tx = await contract.createCampaign(
          title,
          tokenAddress,
          goalBigNumber,
          durationNumber,
          isNoLimit,
          { gasLimit }
        );

        await tx.wait();
        const count = await contract.campaignCount();

        return {
          chainCampaignId: Number(count) - 1,
          txHash: tx.hash,
        };
      } catch (error) {
        console.error("Create campaign error:", error);
        const errorMessage = sanitizeErrorMessage(error.message);
        throw new Error(errorMessage);
      }
    },
    [getContract, estimateGasWithBuffer, sanitizeErrorMessage]
  );

  // Optimized ETH donation
  const donateETH = useCallback(
    async (campaignId, amountInEther) => {
      try {
        const contract = await getContract();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const balance = await provider.getBalance(userAddress);
        const amountInWei = ethers.parseEther(amountInEther);

        // Estimate gas costs
        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice;
        const gasLimit = await estimateGasWithBuffer(
          contract,
          "donate",
          [campaignId, amountInWei],
          { value: amountInWei }
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
          gasLimit,
          gasPrice,
        });

        const receipt = await tx.wait();

        return {
          txHash: tx.hash,
          receipt,
        };
      } catch (error) {
        console.error("Donation error:", error);

        if (error.code === "INSUFFICIENT_FUNDS") {
          throw new Error(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
        }

        throw error;
      }
    },
    [getContract, estimateGasWithBuffer]
  );

  // Optimized token donation with better error handling
  const donateToken = useCallback(
    async (campaignId, tokenAddress, amount, decimals = 18) => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        // Token contract interface
        const tokenABI = [
          "function approve(address spender, uint256 amount) public returns (bool)",
          "function allowance(address owner, address spender) public view returns (uint256)",
          "function balanceOf(address account) public view returns (uint256)",
          "function decimals() public view returns (uint8)",
        ];

        const tokenContract = new ethers.Contract(
          tokenAddress,
          tokenABI,
          signer
        );

        // Verify and get actual decimals
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

        // Check and handle allowance
        const currentAllowance = await tokenContract.allowance(
          userAddress,
          CONTRACT_ADDRESS
        );

        if (currentAllowance < parsedAmount) {
          const approveTx = await tokenContract.approve(
            CONTRACT_ADDRESS,
            parsedAmount
          );
          const approveReceipt = await approveTx.wait();

          if (!approveReceipt.status) {
            throw new Error(ERROR_MESSAGES.APPROVAL_FAILED);
          }

          // Verify approval
          const newAllowance = await tokenContract.allowance(
            userAddress,
            CONTRACT_ADDRESS
          );
          if (newAllowance < parsedAmount) {
            throw new Error(ERROR_MESSAGES.APPROVAL_FAILED);
          }
        }

        // Execute donation
        const contract = await getContract();
        const gasLimit = await estimateGasWithBuffer(contract, "donate", [
          campaignId,
          parsedAmount,
        ]);

        const tx = await contract.donate(campaignId, parsedAmount, {
          gasLimit,
        });
        const receipt = await tx.wait();

        if (!receipt.status) {
          throw new Error("Giao dịch quyên góp thất bại");
        }

        return {
          txHash: tx.hash,
          receipt,
        };
      } catch (error) {
        console.error("Token donation error:", error);

        if (error.code === "ACTION_REJECTED") {
          throw new Error(ERROR_MESSAGES.TRANSACTION_REJECTED);
        }

        if (error.message.includes("allowance")) {
          throw new Error(ERROR_MESSAGES.NEED_APPROVAL);
        }

        if (error.message.includes("insufficient")) {
          throw new Error(ERROR_MESSAGES.INSUFFICIENT_TOKEN);
        }

        throw new Error(error.message || "Quyên góp token thất bại");
      }
    },
    [getContract, estimateGasWithBuffer]
  );

  // Event listener helper with cleanup
  const createEventListener = useCallback(
    (eventName, callback) => {
      return async (campaignId, dbCampaignId) => {
        const contract = await getContract();

        const eventHandler = async (...args) => {
          console.log(`${eventName} event:`, args);
          try {
            await callback(dbCampaignId, ...args);
          } catch (error) {
            console.error(`Error handling ${eventName} event:`, error);
          }
        };

        contract.on(eventName, eventHandler);

        return () => {
          contract.off(eventName, eventHandler);
        };
      };
    },
    [getContract]
  );

  // Optimized contract read operations
  const getContractData = useCallback(
    async (method, ...args) => {
      try {
        const contract = await getContract();
        return await contract[method](...args);
      } catch (error) {
        console.error(`Error calling ${method}:`, error);
        throw error;
      }
    },
    [getContract]
  );

  return useMemo(
    () => ({
      // Campaign operations
      createCampaign,

      // Donation operations
      donateETH,
      donateToken,

      // Contract read operations
      getDonors: (campaignId) => getContractData("getDonors", campaignId),
      getCampaignStatus: (campaignId) =>
        getContractData("getCampaignStatus", campaignId),
      getCampaign: (campaignId) => getContractData("campaigns", campaignId),
      getCampaignCount: () => getContractData("campaignCount"),

      // Campaign management
      refund: async (campaignId) => {
        const contract = await getContract();
        const tx = await contract.refund(campaignId);
        await tx.wait();
      },

      closeCampaign: async (campaignId) => {
        try {
          const contract = await getContract();
          const gasLimit = await estimateGasWithBuffer(
            contract,
            "closeCampaign",
            [campaignId]
          );
          const tx = await contract.closeCampaign(campaignId, { gasLimit });
          const receipt = await tx.wait();

          return {
            txHash: tx.hash,
            receipt,
          };
        } catch (error) {
          console.error("Close campaign error:", error);
          if (error.code === "ACTION_REJECTED") {
            throw new Error(ERROR_MESSAGES.TRANSACTION_REJECTED);
          }
          throw error;
        }
      },

      // Advanced queries
      getCampaignCloseHistory: async (campaignId) => {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (!accounts || accounts.length === 0) {
            throw new Error("Vui lòng kết nối ví để xem thông tin này");
          }

          const history = await getContractData(
            "getCampaignCloseHistory",
            campaignId
          );
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
          const info = await getContractData(
            "getDonorInfo",
            campaignId,
            donorAddress
          );
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

      // Event listeners
      listenToFundsWithdrawn: createEventListener(
        "FundsWithdrawn",
        async (dbCampaignId) => {
          await updateCampaign(dbCampaignId, { status: "FINISHED" });
        }
      ),

      listenToCampaignClosed: createEventListener(
        "CampaignClosed",
        async (dbCampaignId, _campaignId, reachedGoal) => {
          await updateCampaign(dbCampaignId, {
            status: reachedGoal ? "FINISHED" : "CANCELLED",
          });
        }
      ),

      listenToDonationMade: async (campaignId, callback) => {
        const contract = await getContract();

        const donationHandler = async (_campaignId, donor, amount) => {
          console.log("DonationMade event:", {
            campaignId: Number(_campaignId),
            donor,
            amount: amount.toString(),
          });

          if (Number(_campaignId) === Number(campaignId) && callback) {
            callback();
          }
        };

        contract.on("DonationMade", donationHandler);

        return () => {
          contract.off("DonationMade", donationHandler);
        };
      },
    }),
    [
      createCampaign,
      donateETH,
      donateToken,
      getContractData,
      estimateGasWithBuffer,
      createEventListener,
      getContract,
    ]
  );
};
