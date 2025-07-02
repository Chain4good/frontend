import { useAccount, useSignMessage, useDisconnect, useChainId } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { loginWithWeb3 } from "@/services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";

// 1. Ký message
export function useWallet() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();
  const chainId = useChainId();
  const { signMessage, signMessageAsync } = useSignMessage();
  const navigate = useNavigate();

  // Ref để theo dõi trạng thái đang chờ auto-login
  const pendingAutoLogin = useRef(false);
  const isLoggingIn = useRef(false);

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
      pendingAutoLogin.current = false;
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  // Function để xử lý signing và login
  const performSignAndLogin = useCallback(
    async (walletAddress) => {
      if (isLoggingIn.current) return; // Tránh duplicate calls

      try {
        isLoggingIn.current = true;

        if (!walletAddress) {
          toast.error("Không tìm thấy địa chỉ ví");
          return;
        }

        const message = `Chain4Good login: ${walletAddress}`;
        const signature = await signMessageAsync({ message });
        const res = await loginWithWeb3(walletAddress, signature);

        if (res.data) {
          toast.success("Đăng nhập thành công");
          navigate("/");
          return res.data;
        }
      } catch (error) {
        console.error("Web3 login failed:", error);
        if (error.code === "ACTION_REJECTED") {
          toast.error("Bạn đã từ chối ký tin nhắn");
        } else if (error.name === "UserRejectedRequestError") {
          toast.error("Bạn đã từ chối ký tin nhắn");
        } else {
          toast.error("Đăng nhập thất bại: " + error.message);
        }
      } finally {
        isLoggingIn.current = false;
        pendingAutoLogin.current = false;
      }
    },
    [signMessageAsync, navigate]
  );

  // Auto-login effect khi wallet được kết nối
  useEffect(() => {
    if (
      pendingAutoLogin.current &&
      isConnected &&
      address &&
      !isLoggingIn.current
    ) {
      // Delay nhỏ để đảm bảo state đã được cập nhật hoàn toàn
      const timer = setTimeout(() => {
        if (pendingAutoLogin.current && address) {
          performSignAndLogin(address);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isConnected, address, performSignAndLogin]);

  const handleWeb3Login = async () => {
    try {
      if (!isConnected) {
        // Set flag để auto-login sau khi connect
        pendingAutoLogin.current = true;
        const connected = await connect();
        if (!connected) {
          pendingAutoLogin.current = false;
          toast.error("Không thể kết nối ví");
          return;
        }
        // Không cần làm gì thêm, useEffect sẽ handle auto-login
      } else {
        // Đã kết nối, thực hiện signing ngay
        await performSignAndLogin(address);
      }
    } catch (error) {
      console.error("Web3 login initiation failed:", error);
      pendingAutoLogin.current = false;
      toast.error("Có lỗi xảy ra: " + error.message);
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
    isLoggingIn: isLoggingIn.current,
    pendingAutoLogin: pendingAutoLogin.current,
  };
}
