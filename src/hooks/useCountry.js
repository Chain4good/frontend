import { getCountries } from "@/services/countryService";
import { useQuery } from "@tanstack/react-query";

export const useCountry = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });
};
