import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <ShieldAlert className="w-24 h-24 text-destructive animate-pulse" />
            <div className="absolute -right-2 -top-2 bg-destructive text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center">
              !
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-destructive">403</h1>
          <h2 className="text-2xl font-semibold">Truy cập bị từ chối</h2>
          <p className="text-muted-foreground max-w-md">
            Rất tiếc, bạn không có quyền truy cập vào trang này. Vui lòng liên
            hệ quản trị viên nếu bạn cho rằng đây là một sự nhầm lẫn.
          </p>
        </div>

        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
