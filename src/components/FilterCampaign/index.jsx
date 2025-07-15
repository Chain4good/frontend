import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCountry } from "@/hooks/useCountry";
import { useCategory } from "@/hooks/useCategory";
import { useFundraiseType } from "@/hooks/useFundraiseType";
import { Button } from "../ui/button";
import { Filter, FilterX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

const FilterCampaign = ({ setFilters, onClearFilters, filters }) => {
  const { data: countries } = useCountry();
  const { data: categories } = useCategory();
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

  const isFiltersActive =
    filters.countryId || filters.categoryId || filters.fundraiseTypeId;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative pb-4 w-full overflow-hidden"
    >
      <ScrollArea className="w-full pb-4">
        <div className="flex flex-nowrap gap-2 items-center min-w-full px-4 md:px-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full flex items-center gap-2 bg-background/60 backdrop-blur-sm border-muted-foreground/20 hover:border-primary/50 hover:bg-background transition-colors shrink-0"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Lọc</span>
          </Button>

          <Select
            value={filters.countryId}
            onValueChange={(value) => handleChangFilters("countryId", value)}
          >
            <SelectTrigger className="w-[140px] sm:w-[160px] rounded-full bg-background/60 backdrop-blur-sm border-muted-foreground/20 hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Địa điểm" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                <SelectGroup>
                  {countries?.map((country) => (
                    <SelectItem value={country.id} key={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>

          <Select
            value={filters.categoryId}
            onValueChange={(value) => handleChangFilters("categoryId", value)}
          >
            <SelectTrigger className="w-[140px] sm:w-[160px] rounded-full bg-background/60 backdrop-blur-sm border-muted-foreground/20 hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                <SelectGroup>
                  {categories?.data?.map((category) => (
                    <SelectItem value={category.id} key={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>

          <Select
            value={filters.fundraiseTypeId}
            onValueChange={(value) =>
              handleChangFilters("fundraiseTypeId", value)
            }
          >
            <SelectTrigger className="w-[140px] sm:w-[180px] rounded-full bg-background/60 backdrop-blur-sm border-muted-foreground/20 hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Loại quyên góp" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                <SelectGroup>
                  {fundraiseTypes?.map((fundraiseType) => (
                    <SelectItem value={fundraiseType.id} key={fundraiseType.id}>
                      {fundraiseType.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>

          {isFiltersActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="rounded-full flex items-center gap-2 bg-background/60 backdrop-blur-sm border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors shrink-0"
              >
                <FilterX className="w-4 h-4" />
                <span className="hidden sm:inline">Xóa bộ lọc</span>
              </Button>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default FilterCampaign;
