import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col bg-gray-50">
      <div className="text-center space-y-6">
        <img
          src="/undraw_back-home_3dun.svg"
          alt="404 illustration"
          className="w-80 h-8w-80 mx-auto"
        />

        <h1 className="text-4xl font-bold text-gray-900">
          Oops! Trang không tồn tại
        </h1>

        <p className="text-gray-600 max-w-md mx-auto pb-6">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không
          khả dụng.
        </p>

        <Link to="/">
          <Button variant="default" className="gap-2" size="lg">
            <Home className="w-4 h-4" />
            Trở về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
