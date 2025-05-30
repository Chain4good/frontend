import { clsx } from "clsx";
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
export const formatCampaign = (data, id) => ({
  id,
  creator: data[0],
  title: data[1],
  tokenAddress: data[2],
  goal: {
    wei: data[3].toString(),
    eth: formatNumber(Number(data[3]) / 1e18),
    // vnd: formatNumber((Number(data[3]) / 1e18) * exchangeRate),
  },
  totalDonated: {
    wei: data[5].toString(),
    eth: formatNumber(Number(data[5]) / 1e18),
    // vnd: formatNumber((Number(data[5]) / 1e18) * exchangeRate),
    progress: Math.min((Number(data[5]) / Number(data[3])) * 100, 100),
  },
  deadline: data[4],
  isClosed: data[6],
  isNoLimit: data[7],
});

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
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
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
