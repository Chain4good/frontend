import { useSocket } from "@/hooks/useSocket";
import {
  getNotifications,
  getUnreadNotifications,
  markAllAsRead,
  markAsRead,
} from "@/services/notificationService";
import React, { useContext, useEffect, useState } from "react";

const NotificationContext = React.createContext({
  notifications: [],
  unreadCount: 0,
  markAsReadNotification: async () => {},
  markAllAsReadNotification: async () => {},
});

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { notifications, setNotifications } = useSocket();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const markAsReadNotification = async (id) => {
    try {
      await markAsRead(id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsReadNotification = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const data = await getUnreadNotifications();
      setUnreadCount(data);
    };
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await getNotifications(filters);
      setNotifications(data);
      const unreadData = await getUnreadNotifications();
      setUnreadCount(unreadData);
    };
    fetchNotifications();
  }, [filters, setNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsReadNotification,
        markAllAsReadNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => useContext(NotificationContext);
