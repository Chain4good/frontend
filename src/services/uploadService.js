import { UploadV1 } from "@/constants/linkApis";
import requestInstance from "@/services/axiosInstance";
import queryString from "query-string";

export const uploadFile = async (file) => {
  const url = queryString.stringifyUrl({
    url: UploadV1.UPLOADS,
  });
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await requestInstance.post(url, formData);
  return data;
};
