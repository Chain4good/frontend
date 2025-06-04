import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useCampaign from "@/hooks/useCampaign";
import { useCategory } from "@/hooks/useCategory";
import { useCountry } from "@/hooks/useCountry";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Category = () => {
  const { data: categories, isLoading } = useCategory();
  const { data: countries, isLoading: isLoadingCountry } = useCountry();
  const { newCampaign, changeCampaignValue } = useCampaign();
  const location = useLocation();
  const error = location.state?.error;

  if (isLoading || isLoadingCountry) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto space-y-6 md:p-20 p-0">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
          <Select
            value={newCampaign.countryId}
            onValueChange={(value) => changeCampaignValue("countryId", value)}
          >
            <SelectTrigger className="w-full" size="lg">
              <SelectValue placeholder="Địa chỉ" size="lg" />
            </SelectTrigger>
            <SelectContent>
              {countries?.map((country) => (
                <SelectItem value={country.id} key={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="text-xl mb-3">
          Mô tả nào phù hợp nhất với lý do bạn kêu gọi gây quỹ?
        </h2>
        <div>
          <ToggleGroup
            type="single"
            className="flex flex-wrap gap-2 justify-start"
            value={newCampaign.categoryId}
            onValueChange={(value) => changeCampaignValue("categoryId", value)}
          >
            {categories?.data?.map((category) => (
              <ToggleGroupItem
                key={category.id}
                variant="outline"
                className="rounded-xl min-w-fit"
                value={category.id}
                aria-label="category"
              >
                {category.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default Category;
