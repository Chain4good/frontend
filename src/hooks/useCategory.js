import { getCategories } from "@/services/categoryService";
import { useQuery } from "@tanstack/react-query";

export const useCategory = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
};
