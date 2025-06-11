import { CampaignV1 } from "@/constants/linkApis";
import requestInstance from "@/services/axiosInstance";
import queryString from "query-string";

export const createCampaign = async (values) => {
  const url = queryString.stringifyUrl({
    url: CampaignV1.CREATE_CAMPAIGN,
  });
  const { data } = await requestInstance.post(url, values);
  return data;
};

// export const getCampaigns = async () => {
//   const url = queryString.stringifyUrl({
//     url: CampaignV1.GET_CAMPAIGNS,
//   });
//   const { data } = await requestInstance.get(url);
//   return data;
// };

export const getCampaignById = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${CampaignV1.GET_CAMPAIGN}/${id}`,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getMyCampaigns = async (page, limit) => {
  const url = queryString.stringifyUrl({
    url: CampaignV1.GET_MY_CAMPAIGNS,
    query: {
      page,
      limit,
    },
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const updateCampaign = async (id, values) => {
  const url = queryString.stringifyUrl({
    url: `${CampaignV1.UPDATE_CAMPAIGN}/${id}`,
  });
  const { data } = await requestInstance.patch(url, values);
  return data;
};

export const calculateEthGoal = async (amount) => {
  const url = queryString.stringifyUrl({
    url: CampaignV1.GET_CALCULATE_ETH_GOAL,
    query: {
      vndAmount: amount,
    },
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getCampaignsByCategoryId = async (id, page, limit) => {
  const url = queryString.stringifyUrl({
    url: `${CampaignV1.GET_CAMPAIGNS}`,
    query: {
      categoryId: id,
      page,
      limit,
    },
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getCampaigns = async (filters) => {
  // Add artificial delay
  // await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 second delay

  const url = queryString.stringifyUrl({
    url: CampaignV1.GET_CAMPAIGNS_VALID,
    query: {
      ...filters,
    },
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const calculateGoal = async (amount, token) => {
  const url = queryString.stringifyUrl({
    url: CampaignV1.GET_CALCULATE_GOAL,
    query: {
      vndAmount: amount,
      token,
    },
  });
  const { data } = await requestInstance.get(url);
  return data;
};
