import { AuthV1, CategoryV1, CountryV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const getCountries = async () => {
  const url = queryString.stringifyUrl({
    url: CountryV1.GET_COUNTRIES,
  });
  const { data } = await requestInstance.get(url);
  return data;
};
