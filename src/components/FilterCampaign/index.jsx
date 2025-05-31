import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCountry } from "@/hooks/useCountry";
import { useCategory } from "@/hooks/useCategory";
import { useFundraiseType } from "@/hooks/useFundraiseType";
import { Button } from "../ui/button";
import { Filter, FilterXIcon } from "lucide-react";

const FilterCampaign = ({ setFilters, onClearFilters, filters }) => {
  const { data: countries } = useCountry();
  const { data: categories, isLoading } = useCategory();
  const { data: fundraiseTypes } = useFundraiseType();

  const handleChangFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    handleChangFilters("countryId", undefined);
    handleChangFilters("categoryId", undefined);
    handleChangFilters("fundraiseTypeId", undefined);

    onClearFilters();
  };

  return (
    <div className="pb-4 flex gap-1 items-center">
      <Button
        variant="outline"
        className="rounded-full flex items-center justify-center border border-black"
      >
        <Filter className="" />
        Lọc
      </Button>
      <Select
        value={filters.countryId}
        onValueChange={(value) => handleChangFilters("countryId", value)}
      >
        <SelectTrigger className="w-fit rounded-full border-1 border border-black">
          <SelectValue placeholder="Địa điểm" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {countries?.map((country) => (
              <SelectItem value={country.id} key={country.id}>
                {country.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={filters.categoryId}
        onValueChange={(value) => handleChangFilters("categoryId", value)}
      >
        <SelectTrigger className="w-fit rounded-full border-1 border border-black">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {categories?.data?.map((category) => (
              <SelectItem value={category.id} key={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={filters.fundraiseTypeId}
        onValueChange={(value) => handleChangFilters("fundraiseTypeId}", value)}
      >
        <SelectTrigger className="w-fit rounded-full border-1 border border-black">
          <SelectValue placeholder="Loại quyên góp" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {fundraiseTypes?.map((fundraiseType) => (
              <SelectItem value={fundraiseType.id} key={fundraiseType.id}>
                {fundraiseType.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        className="rounded-full flex items-center justify-center border border-black"
        onClick={handleClearFilters}
      >
        <FilterXIcon className="" />
        Xóa bộ lọc
      </Button>
    </div>
  );
};

export default FilterCampaign;
