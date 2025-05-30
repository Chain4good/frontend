import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const MetaMaskAccount = () => {
  const [account, setAccount] = useState(null);

  const getCurrentAccount = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.message(
        "Vui lòng cài MetaMask và mở trang này bằng trình duyệt trong MetaMask."
      );
      return;
    }
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      toast.message("Vui lòng cài MetaMask!");
    }
  };

  useEffect(() => {
    getCurrentAccount();
  }, []);

  const shortenAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <Button
      variant={account ? "secondary" : "default"}
      className="w-32 rounded-full text-xs font-medium transition-all"
      onClick={getCurrentAccount}
    >
      {account ? shortenAddress(account) : "Kết nối ví"}
    </Button>
  );
};

export default MetaMaskAccount;
