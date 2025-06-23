import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import CharityHeartsABI from "../contracts/abi/CharityHearts.json";

const contractAddress = "0x80c5FCa4E56bF2e48C0CA40b2b30E8C719cdf19C";

export const useNFTLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy tất cả events NFTMinted
  const fetchMintEvents = useCallback(async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        CharityHeartsABI.abi,
        provider
      );

      // 1. Kiểm tra events
      const currentBlock = await provider.getBlockNumber();
      console.log("Current block:", currentBlock);

      const fromBlock = Math.max(0, currentBlock - 5000);
      console.log("Fetching events from block:", fromBlock);

      const events = await contract.queryFilter(
        contract.filters.NFTMinted(),
        fromBlock,
        "latest"
      );
      console.log("Found events:", events);

      // 2. Kiểm tra event args
      const mintCounts = events.reduce((acc, event) => {
        console.log("Event:", event);
        console.log("Event args:", event.args);
        const address = event.args[0]; // Thử lấy argument đầu tiên thay vì .to
        if (address) {
          acc[address] = (acc[address] || 0) + 1;
        }
        return acc;
      }, {});
      console.log("Mint counts:", mintCounts);

      // 3. Chuyển đổi thành array
      const leaderboardArray = Object.entries(mintCounts)
        .map(([address, count]) => ({
          address,
          count,
          // Thêm shortAddress để hiển thị
          shortAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
        }))
        .sort((a, b) => b.count - a.count);

      console.log("Final leaderboard:", leaderboardArray);

      setLeaderboard(leaderboardArray);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Fetch data khi component mount
  useEffect(() => {
    fetchMintEvents();

    // Lắng nghe event mới
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      CharityHeartsABI.abi,
      provider
    );

    const handleNewMint = (to, tokenId, uri) => {
      fetchMintEvents(); // Refresh leaderboard
    };

    contract.on("NFTMinted", handleNewMint);

    return () => {
      contract.off("NFTMinted", handleNewMint);
    };
  }, [fetchMintEvents]);

  return { leaderboard, loading, error };
};
