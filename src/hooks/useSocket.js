import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import useUserStore from "./useUserStore";

const SOCKET_URL =
  import.meta.env.VITE_APP_BACKEND_URL || "https://api.chain4good.io.vn";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useUserStore();

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      if (user?.id) {
        socketInstance.emit("join", user.id);
      }
    });

    socketInstance.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.content);
    });

    socketInstance.on("disconnect", () => {
      // console.log("Disconnected from socket server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return { socket, notifications, setNotifications };
};
