import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React from "react";

const crategories = [
  "Động vật",
  "Kinh doanh",
  "Cộng đồng",
  "Cuộc thi",
  "Sáng tạo",
  "Giáo dục",
  "Trường hợp khẩn cấp",
  "Môi trường",
  "Sự kiện",
  "Tín ngưỡng",
  "Gia đình",
  "Tang lễ & Tưởng niệm",
  "Y tế",
  "Thanh toán hóa đơn hàng tháng",
  "Cô dâu chú rể mới cưới",
  "Khác",
  "Thể thao",
  "Du lịch",
  "Hỗ trợ Ukraine",
  "Tình nguyện",
  "Điều ước",
];

const CategoryPage = () => {
  return (
    <div className="container mx-auto space-y-6 md:p-20 p-0">
      <div>
        <h2 className="font-semibold text-xl">
          Các khoản tiền sẽ được sử dụng vào đâu?
        </h2>
        <p className="text-muted-foreground">
          Chọn nơi bạn muốn rút khoản tiền quyên góp.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <Select className="">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Địa chỉ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <Input className="" placeholder="Zip code" />
        </div>
      </div>

      <div>
        <h2 className="text-xl mb-3">Mô tả nào phù hợp nhất với lý do bạn kêu gọi gây quỹ?</h2>
        <div>
          <ToggleGroup type="single" className="flex flex-wrap gap-2 justify-start">
            {crategories.map((category) => (
              <ToggleGroupItem variant="outline" className="rounded-xl" value={category} aria-label="category">
                {category}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
