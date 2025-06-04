import { createRoot } from "react-dom/client";
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

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NotificationProvider>
  </HelmetProvider>
);
