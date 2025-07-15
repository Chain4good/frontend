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

export const optimizeCampaign = async (values) => {
  const url = queryString.stringifyUrl({
    url: AiV1.AI_OPTIMIZE_CAMPAIGN,
  });
  const { data } = await requestInstance.post(url, values);
  return data;
};

export const recommendations = async () => {
  const url = queryString.stringifyUrl({
    url: AiV1.AI_RECOMMENDATIONS,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const generateCampaignAudio = async (campaignId) => {
  const url = queryString.stringifyUrl({
    url: AiV1.AI_CAMPAIGN_AUDIO + campaignId + "/audio",
  });
  const { data } = await requestInstance.get(url);
  return data;
};
