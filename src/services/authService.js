import { AuthV1 } from "@/constants/linkApis";
import useUserStore from "@/hooks/useUserStore";
import requestInstance from "@/services/axiosInstance";
import queryString from "query-string";

export const signup = async (data) => {
  const url = queryString.stringifyUrl({
    url: AuthV1.REGISTER,
  });
  const response = await requestInstance.post(url, data);
  return response;
};

export const signin = async (data) => {
  const url = queryString.stringifyUrl({
    url: AuthV1.LOGIN,
  });
  const response = await requestInstance.post(url, data);
  return response;
};

export const getProfile = async () => {
  const url = queryString.stringifyUrl({
    url: AuthV1.GET_PROFILE,
  });
  const response = await requestInstance.get(url);
  const userStore = useUserStore.getState();
  userStore.setUser(response.data);
  return response;
};
