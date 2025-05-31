import { AiV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";
export const analyzeCampaign = async (values) => {
  const url = queryString.stringifyUrl({
    url: AiV1.AI_ANALYZE_CAMPAIGN,
  });
  const { data } = await requestInstance.post(url, values);
  return data;
};
