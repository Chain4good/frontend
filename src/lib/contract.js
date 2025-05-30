import { ethers } from "ethers";

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      return { provider, signer, address };
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("MetaMask chưa được cài!");
  }
}

export { connectWallet };
