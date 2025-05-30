import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="flex items-center justify-center">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
