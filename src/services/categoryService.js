import { AuthV1, CategoryV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const getCategories = async () => {
  const url = queryString.stringifyUrl({
    url: CategoryV1.GET_CATEGORIES,
  });
  const { data } = await requestInstance.get(url);
  return { data };
};

export const getCategoryById = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${CategoryV1.GET_CATEGORY}/${id}`,
  });
  const { data } = await requestInstance.get(url);
  return data;
};
