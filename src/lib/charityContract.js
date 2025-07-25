import ABI from "@/contracts/abi/ChariFyDonation.json";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xb9Eaa1a24c4f690e546C4832B87EddF27c686F1E";

export const getContract = async () => {
  if (!window.ethereum) throw new Error("Metamask chưa được cài đặt");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};

export const createCampaign = async (
  title,
  goal,
  duration,
  isNoLimit = false
) => {
  const contract = await getContract();
  const campaign = await contract.createCampaign(
    title,
    ethers.parseEther(goal),
    duration,
    isNoLimit
  );
  return campaign;
};

export async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (error) {
      console.error("User rejected the request:", error);
      return null;
    }
  } else {
    console.error("MetaMask is not installed!");
    return null;
  }
}
