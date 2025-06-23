const CONTRACT_ADDRESS = "0x80c5FCa4E56bF2e48C0CA40b2b30E8C719cdf19C";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import CharityHeartsABI from "../contracts/abi/CharityHearts.json";
import { uploadMetadata } from "@/storage/upload-metadata";

const mintPrice = ethers.parseEther("0.000001");

export const useCharityHearts = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initContract = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask!");
      return;
    }

    try {
      const [selectedAccount] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Thay đổi từ providers.Web3Provider sang BrowserProvider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // Thêm await vì getSigner() giờ là async

      const charityHearts = new ethers.Contract(
        CONTRACT_ADDRESS,
        CharityHeartsABI.abi,
        signer
      );

      setContract(charityHearts);
      setAccount(selectedAccount);
      setError(null);
    } catch (err) {
      setError(err.message);
      setContract(null);
      setAccount(null);
    }
  }, []);

  useEffect(() => {
    initContract();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setContract(null);
      } else {
        setAccount(accounts[0]);
        initContract();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    // Subscribe to events
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [initContract]);

  const mintNFT = useCallback(
    async (metadata) => {
      if (!contract) return;
      if (!metadata || !metadata.image || !metadata.name) {
        setError("Metadata must include image and name.");
        return;
      }

      setIsLoading(true);
      try {
        const data = await uploadMetadata(metadata);
        if (!data) {
          setError("Failed to upload metadata.");
          return;
        }
        const tx = await contract.publicMint(data, {
          value: mintPrice,
        });
        await tx.wait();
        return tx;
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  const getUserNFTs = useCallback(async () => {
    if (!contract || !account) return [];
    try {
      const tokens = await contract.tokensOfOwner(account);
      const nfts = await Promise.all(
        tokens.map(async (tokenId) => {
          const [tokenURI, owner] = await Promise.all([
            contract.tokenURI(tokenId),
            contract.ownerOf(tokenId),
          ]);

          return {
            tokenId: tokenId.toString(),
            tokenURI,
          };
        })
      );
      return nfts;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [contract, account]);

  // Thêm hàm getNFTLeaderboard
  const getNFTLeaderboard = useCallback(async () => {
    if (!contract) return [];
    try {
      // Lấy các event trong 10000 block gần nhất
      const provider = new ethers.BrowserProvider(window.ethereum);
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000);

      const events = await contract.queryFilter(
        contract.filters.Transfer(),
        fromBlock,
        "latest"
      );

      const nftCounts = events.reduce((acc, event) => {
        const to = event.args[1];
        if (to && to !== ethers.ZeroAddress) {
          acc[to] = (acc[to] || 0) + 1;
        }
        return acc;
      }, {});
      console.log("NFT Counts:", nftCounts);

      const leaderboard = await Promise.all(
        Object.entries(nftCounts).map(async ([address, count]) => {
          const nfts = await contract.tokensOfOwner(address);
          return {
            address,
            count: nfts.length,
            totalMinted: count,
            shortAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
          };
        })
      );

      return leaderboard.sort((a, b) => b.count - a.count);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(err.message);
      return [];
    }
  }, [contract]);

  const getContractInfo = useCallback(async () => {
    if (!contract) return null;
    try {
      const [maxSupply, totalSupply, maxMintPerAddress, mintedByUser] =
        await Promise.all([
          contract.maxSupply(),
          contract.totalSupply(),
          contract.maxMintPerAddress(),
          contract.mintedByAddress(account),
        ]);

      return {
        maxSupply: maxSupply.toString(),
        totalSupply: totalSupply.toString(),
        maxMintPerAddress: maxMintPerAddress.toString(),
        mintedByUser: mintedByUser.toString(),
      };
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [contract, account]);

  return {
    contract,
    account,
    error,
    isLoading,
    mintNFT,
    getUserNFTs,
    getContractInfo,
    getNFTLeaderboard, // Thêm hàm mới vào đây
  };
};
