import { NFT_RARITY } from "@/constants/nft";
import { randomizePosition } from "./helper";

export const getNFTRarityByChance = () => {
  // Validate rarity chances before proceeding
  validateNFTRarity();

  const random = Math.random() * 100; // Random từ 0-100
  let accumulatedChance = 0;

  // Định nghĩa thứ tự check từ common đến legendary
  const rarityOrder = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];

  for (const rarity of rarityOrder) {
    const chance = parseFloat(NFT_RARITY[rarity].chance); // Convert "50%" -> 50
    accumulatedChance += chance;

    if (random <= accumulatedChance) {
      return NFT_RARITY[rarity];
    }
  }

  return NFT_RARITY.COMMON; // Fallback về Common nếu có lỗi
};

// Sử dụng trong generateNFTMetadata
export const generateNFTMetadata = (donorName, donationAmount) => {
  try {
    const rarity = getNFTRarityByChance();
    const images = rarity.images;

    const randomImageIndex = randomizePosition(0, images.length - 1);
    const image = images[randomImageIndex];

    const ipfsHash = image.split("ipfs.w3s.link/")[0].split("https://")[1];
    const ipfsUri = `ipfs://${ipfsHash}`;

    return {
      name: `Charity Donor NFT - ${rarity.label}`,
      description: `NFT tặng cho nhà hảo tâm ${donorName} đã quyên góp ${donationAmount}.`,
      image: ipfsUri,
      attributes: [
        {
          trait_type: "Rarity",
          value: rarity.label,
        },
        {
          trait_type: "Donor",
          value: donorName,
        },
        {
          trait_type: "Donation Amount",
          value: donationAmount,
        },
      ],
    };
  } catch (error) {
    console.error("Error in NFT rarity validation:", error);
    throw error;
  }
};

export const validateNFTRarity = () => {
  const totalChance = Object.values(NFT_RARITY).reduce(
    (sum, rarity) => sum + parseFloat(rarity.chance),
    0
  );

  if (Math.abs(totalChance - 100) > 0.01) {
    throw new Error(
      `Total chance must be 100%. Current total: ${totalChance}%`
    );
  }
  return true;
};

// Test distribution
export function testDistribution(iterations = 10000) {
  const distribution = {
    COMMON: 0,
    UNCOMMON: 0,
    RARE: 0,
    EPIC: 0,
    LEGENDARY: 0,
  };

  for (let i = 0; i < iterations; i++) {
    const result = getNFTRarityByChance();
    distribution[
      Object.keys(NFT_RARITY).find((key) => NFT_RARITY[key].id === result.id)
    ]++;
  }

  // Log percentages
  Object.entries(distribution).forEach(([key, value]) => {
    console.log(`${key}: ${(value / iterations) * 100}`);
  });
}
