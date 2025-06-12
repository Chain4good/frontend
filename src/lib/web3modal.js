import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { sepolia, mainnet } from "viem/chains";

const projectId = "94792c7cb2185b288d299315097dc236";

const metadata = {
  name: "Chain4Good",
  description: "Nền tảng gây quỹ từ thiện phi tập trung",
  url: "https://chain4good.io.vn",
  icons: ["https://chain4good.io.vn/logo.png"],
};

const chains = [sepolia, mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "rgb(34 197 94)", // Màu primary của bạn
  },
});

export { wagmiConfig };
