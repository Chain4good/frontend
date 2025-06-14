import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useChainId } from "wagmi";

export function useWallet() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();
  const chainId = useChainId();
  const { signMessage } = useSignMessage();

  const connect = async () => {
    try {
      await open();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  return {
    address,
    isConnected,
    chainId,
    connect,
    disconnect,
    signMessage,
  };
}
