import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "./lib/web3modal";

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>{/* ...rest of your app */}</WagmiConfig>
  );
}
