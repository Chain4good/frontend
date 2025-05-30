import {
  AuthV1,
  CategoryV1,
  CountryV1,
  FundraiseTypeV1,
} from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const getFundraiseTypes = async () => {
  const url = queryString.stringifyUrl({
    url: FundraiseTypeV1.GET_FUNDRAISE_TYPES,
  });
  const { data } = await requestInstance.get(url);
  return data;
};
