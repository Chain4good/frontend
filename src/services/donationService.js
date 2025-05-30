import { DonationV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const createDonation = async (values) => {
  const url = queryString.stringifyUrl({
    url: DonationV1.CREATE_DONATION,
  });
  const { data } = await requestInstance.post(url, values);
  return data;
};

export const getDonations = async () => {
  const url = queryString.stringifyUrl({
    url: DonationV1.GET_DONATIONS,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getDonationById = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${DonationV1.GET_DONATION}/${id}`,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const updateDonation = async (id, values) => {
  const url = queryString.stringifyUrl({
    url: `${DonationV1.UPDATE_DONATION}/${id}`,
  });
  const { data } = await requestInstance.patch(url, values);
  return data;
};

export const deleteDonation = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${DonationV1.DELETE_DONATION}/${id}`,
  });
  const { data } = await requestInstance.delete(url);
  return data;
};
