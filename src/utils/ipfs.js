export const fetchTokenMetadata = async (tokenURI) => {
  try {
    const ipfsHash = tokenURI.split("ipfs://")[1];

    const gateways = [
      `https://ipfs.io/ipfs/${ipfsHash}`,
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
    ];

    for (const gateway of gateways) {
      try {
        const response = await fetch(gateway);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn(`Gateway ${gateway} failed:`, err);
        continue;
      }
    }

    throw new Error("All IPFS gateways failed");
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return null;
  }
};

export const resolveIPFSUrl = (url) => {
  if (!url) return "";

  if (url.includes(".ipfs.w3s.link")) {
    return url.replace("ipfs://", "https://");
  }

  if (url.startsWith("ipfs://")) {
    const hash = url.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${hash}`;
  }

  return url;
};
