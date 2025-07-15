import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/globals.css";
import "./styles/post.css";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { NotificationProvider } from "./components/NotificationProvider";
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "./lib/web3modal";
import { ThemeProvider } from "./components/theme-provider";
// import { ThirdwebProvider } from "@thirdweb-dev/react";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <ThirdwebProvider activeChain="sepolia">
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="charity-theme">
      <HelmetProvider>
        <WagmiConfig config={wagmiConfig}>
          <NotificationProvider>
            <QueryClientProvider client={queryClient}>
              <Toaster position="top-center" />
              <RouterProvider router={router} />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </NotificationProvider>
        </WagmiConfig>
      </HelmetProvider>
    </ThemeProvider>
  </React.StrictMode>
  // </ThirdwebProvider>
);
