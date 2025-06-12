import { useAccount, useSignMessage } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useChainId } from "wagmi";

export function useWallet() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessage } = useSignMessage();

  const connect = async () => {
    try {
      await open();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return {
    address,
    isConnected,
    chainId,
    connect,
    signMessage,
  };
}
