import { CommentV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";
export const getCommentsByCampaign = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${CommentV1.GET_COMMENT_BY_CAMPAIGN}/${id}`,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const createComment = async (values) => {
  const url = queryString.stringifyUrl({
    url: CommentV1.CREATE_COMMENT,
  });
  const { data } = await requestInstance.post(url, values);
  return data;
};
