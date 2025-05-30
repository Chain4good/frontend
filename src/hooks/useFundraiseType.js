import { getFundraiseTypes } from "@/services/fundraiseTypeService";
import { useQuery } from "@tanstack/react-query";

export const useFundraiseType = () => {
  return useQuery({
    queryKey: ["fundraiseTypes"],
    queryFn: () => getFundraiseTypes(),
  });
};
