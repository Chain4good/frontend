import { logout } from "@/services/authService";
import React, { useEffect } from "react";
import { toast } from "sonner";

const Logout = () => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        const message = await logout();
        toast.success(message);
        window.location.href = "/";
      } catch (error) {
        toast.error(error.message);
      }
    };
    handleLogout();
  }, []);
  return null;
};

export default Logout;
