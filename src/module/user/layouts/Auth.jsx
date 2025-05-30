import { useProfile } from "@/hooks/useAuth";
import React from "react";

const Auth = () => {
  const { data, isLoading } = useProfile();
  return null;
};

export default Auth;
