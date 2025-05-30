import { CoverV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const createCover = async (media, type) => {
  const url = queryString.stringifyUrl({
    url: CoverV1.CREATE_COVER,
  });
  const { data } = await requestInstance.post(url, {
    url: media,
    type: type ?? "IMAGE",
  });
  return data;
};
