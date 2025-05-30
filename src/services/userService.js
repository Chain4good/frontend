import { UserV1 } from "@/constants/linkApis";
import requestInstance from "@/services/axiosInstance";
import queryString from "query-string";

export const updateUser = async (id, values) => {
  const url = queryString.stringifyUrl({
    url: UserV1.UPDATE_USER + `/${id}`,
  });
  const { data } = await requestInstance.patch(url, values);
  return data;
};

export const updateUserImage = async (userId, data) => {
  const url = queryString.stringifyUrl({
    url: `${UserV1.UPDATE_USER}/${userId}`,
  });
  const response = await requestInstance.patch(url, data);
  return response.data;
};
