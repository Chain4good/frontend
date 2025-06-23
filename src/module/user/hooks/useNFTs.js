import { useCallback, useEffect, useState } from "react";
import { fetchTokenMetadata, resolveIPFSUrl } from "@/utils/ipfs";

export const useNFTs = (getUserNFTs) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNFTs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserNFTs();

      const nftsWithMetadata = await Promise.all(
        data.map(async (nft) => {
          try {
            const metadata = await fetchTokenMetadata(nft.tokenURI);
            return {
              ...nft,
              metadata: {
                ...metadata,
                image: resolveIPFSUrl(metadata?.image),
              },
            };
          } catch (err) {
            console.error(
              `Error fetching metadata for NFT ${nft.tokenId}:`,
              err
            );
            return {
              ...nft,
              metadata: {
                name: `NFT #${nft.tokenId}`,
                image: null,
                description: "Metadata unavailable",
              },
            };
          }
        })
      );

      setNfts(nftsWithMetadata);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to load NFTs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [getUserNFTs]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  const refetch = useCallback(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    loading,
    error,
    refetch,
  };
};
