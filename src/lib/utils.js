import { TOKENS } from "@/constants/tokens";
import { clsx } from "clsx";
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
export const formatCampaign = (data) => {
  // Determine token decimals based on tokenAddress
  const getTokenDecimals = (tokenAddress) => {
    // If tokenAddress is USDC
    if (tokenAddress?.toLowerCase() === TOKENS.USDC.address.toLowerCase()) {
      return 6; // USDC uses 6 decimals
    }
    // If tokenAddress is WETH
    if (tokenAddress?.toLowerCase() === TOKENS.WETH.address.toLowerCase()) {
      return 18; // WETH uses 18 decimals
    }
    // Default to 18 decimals for ETH and other tokens
    return 18;
  };

  const decimals = getTokenDecimals(data[2]); // data[2] is tokenAddress

  // Format numbers based on token decimals
  const formatTokenAmount = (amount) => {
    return Number(amount) / Math.pow(10, decimals);
  };

  const getTokenSymbol = (tokenAddress) => {
    if (!tokenAddress || tokenAddress === ethers.ZeroAddress) {
      return "ETH";
    }
    if (tokenAddress.toLowerCase() === TOKENS.USDC.address.toLowerCase()) {
      return "USDC";
    }
    if (tokenAddress.toLowerCase() === TOKENS.WETH.address.toLowerCase()) {
      return "WETH";
    }
    return "Unknown";
  };

  return {
    creator: data[0],
    title: data[1],
    tokenAddress: data[2],
    goal: {
      wei: data[3].toString(),
      formatted: formatTokenAmount(data[3]).toString(),
      symbol: getTokenSymbol(data[2]),
    },
    deadline: data[4],
    totalDonated: {
      wei: data[5].toString(),
      formatted: formatTokenAmount(data[5]).toString(),
      symbol: getTokenSymbol(data[2]),
      progress: Math.min((Number(data[5]) / Number(data[3])) * 100, 100),
    },
    isClosed: data[6],
    isNoLimit: data[7],
  };
};

// Helper function to get token symbol
const getTokenSymbol = (tokenAddress) => {
  if (!tokenAddress || tokenAddress === ethers.ZeroAddress) {
    return "ETH";
  }
  if (tokenAddress.toLowerCase() === TOKENS.USDC.address.toLowerCase()) {
    return "USDC";
  }
  if (tokenAddress.toLowerCase() === TOKENS.WETH.address.toLowerCase()) {
    return "WETH";
  }
  return "Unknown";
};

export const formatNumber = (value) => {
  return parseFloat(value).toLocaleString("vi-VN");
};

export const formattedDonors = (donors) => {
  return donors.map((addr, index) => ({
    index: index + 1,
    address: addr,
    short: `${addr.slice(0, 6)}...${addr.slice(-4)}`,
  }));
};

export const validateFile = (file) => {
  const maxSize = 100 * 1024 * 1024; // 100MB
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

  if (file.size > maxSize) {
    alert("File is too large. Maximum size is 100MB");
    return false;
  }

  if (![...allowedImageTypes, ...allowedVideoTypes].includes(file.type)) {
    alert("File type not supported");
    return false;
  }

  return true;
};
