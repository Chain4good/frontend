import { useAccount, useSignMessage, useDisconnect, useChainId } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { loginWithWeb3 } from "@/services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// 1. Ký message
export function useWallet() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();
  const chainId = useChainId();
  const { signMessage, signMessageAsync } = useSignMessage();
  const navigate = useNavigate();

  const connect = async () => {
    try {
      await open();
      return true;
    } catch (error) {
      console.error("Failed to connect:", error);
      return false;
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const handleWeb3Login = async () => {
    try {
      if (!isConnected) {
        const connected = await connect();
        if (!connected) {
          toast.error("Không thể kết nối ví");
          return;
        }
      }

      if (!address) {
        toast.error("Không tìm thấy địa chỉ ví");
        return;
      }

      const message = `Chain4Good login: ${address}`;
      const signature = await signMessageAsync({ message });
      const res = await loginWithWeb3(address, signature);

      if (res.data) {
        toast.success("Đăng nhập thành công");
        navigate("/");
        return res.data;
      }
    } catch (error) {
      console.error("Web3 login failed:", error);
      if (error.code === "ACTION_REJECTED") {
        toast.error("Bạn đã từ chối ký tin nhắn");
      } else {
        toast.error("Đăng nhập thất bại: " + error.message);
      }
    }
  };

  return {
    address,
    isConnected,
    chainId,
    connect,
    disconnect,
    signMessage,
    handleWeb3Login,
  };
}
