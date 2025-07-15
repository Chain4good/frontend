import { NotificationV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";
export const markAsRead = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${NotificationV1.READ_NOTIFICATION}/${id}/read`,
  });
  const { data } = await requestInstance.patch(url);
  return data;
};

export const getNotifications = async (filters) => {
  const url = queryString.stringifyUrl({
    url: NotificationV1.GET_NOTIFICATIONS,
    query: {
      ...filters,
    },
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const markAllAsRead = async () => {
  const url = queryString.stringifyUrl({
    url: NotificationV1.MARK_ALL_AS_READ,
  });
  const { data } = await requestInstance.patch(url);
  return data;
};

export const getUnreadNotifications = async () => {
  const url = queryString.stringifyUrl({
    url: NotificationV1.UNREAD_COUNT,
  });
  const { data } = await requestInstance.get(url);
  return data;
};
