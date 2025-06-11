import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TOKEN } from "@/hooks/useCharityDonation";

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

// Move getTokenInfo outside to be reusable
export const getTokenInfo = (tokenAddress) => {
  // if (!tokenAddress) {
  //   return {
  //     symbol: "ETH",
  //     decimals: 18,
  //   };
  // }

  // Convert addresses to lowercase for comparison
  const normalizedAddress = tokenAddress?.toLowerCase();

  // Find matching token from TOKEN constant
  for (const [symbol, details] of Object.entries(TOKEN)) {
    if (details.address.toLowerCase() === normalizedAddress) {
      return {
        symbol,
        decimals: details.decimals,
      };
    }
  }

  // Default to ETH if no match found
  // return {
  //   symbol: "ETH",
  //   decimals: 18,
  // };
};

export const formatCampaign = (data, id) => {
  const tokenInfo = getTokenInfo(data[2]);
  const divisor = Math.pow(10, tokenInfo.decimals);

  return {
    id,
    creator: data[0],
    title: data[1],
    tokenAddress: data[2],
    tokenSymbol: tokenInfo.symbol,
    goal: {
      wei: data[3].toString(),
      formatted: formatNumber(Number(data[3]) / divisor),
      symbol: tokenInfo.symbol,
    },
    totalDonated: {
      wei: data[5].toString(),
      formatted: formatNumber(Number(data[5]) / divisor),
      symbol: tokenInfo.symbol,
      progress: Math.min((Number(data[5]) / Number(data[3])) * 100, 100),
    },
    deadline: data[4],
    isClosed: data[6],
    isNoLimit: data[7],
  };
};

export const formatNumber = (value) => {
  return parseFloat(value).toLocaleString("vi-VN");
};

// Update formattedDonors to accept campaignTokenAddress
export const formattedDonors = (donors, campaignTokenAddress) => {
  return donors.map((donor, index) => {
    const tokenInfo = getTokenInfo(campaignTokenAddress);
    const divisor = Math.pow(10, tokenInfo.decimals);

    return {
      index: index + 1,
      address: donor[0],
      short: `${donor[0].slice(0, 6)}...${donor[0].slice(-4)}`,
      totalAmount: {
        wei: donor[1].toString(),
        formatted: formatNumber(Number(donor[1]) / divisor),
        symbol: tokenInfo.symbol,
      },
      donationCount: Number(donor[2]),
      lastDonationTime: new Date(Number(donor[3]) * 1000),
      lastDonationFormatted: formatDate(new Date(Number(donor[3]) * 1000)),
    };
  });
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
