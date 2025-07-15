import { ReportV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const createReport = async (values) => {
  const url = queryString.stringifyUrl({
    url: ReportV1.CREATE_REPORT,
  });
  const { data } = await requestInstance.post(url, values);
  return data;
};
