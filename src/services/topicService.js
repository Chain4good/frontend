import { TopicV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const getTopics = async () => {
  const url = queryString.stringifyUrl({
    url: TopicV1.GET_TOPICS,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const createTopic = async (data) => {
  const url = queryString.stringifyUrl({
    url: TopicV1.CREATE_TOPIC,
  });
  const response = await requestInstance.post(url, data);
  return response;
};

export const updateTopic = async (id, data) => {
  const url = queryString.stringifyUrl({
    url: `${TopicV1.UPDATE_TOPIC}/${id}`,
  });
  const response = await requestInstance.patch(url, data);
  return response;
};

export const deleteTopic = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${TopicV1.DELETE_TOPIC}/${id}`,
  });
  const response = await requestInstance.delete(url);
  return response;
};
