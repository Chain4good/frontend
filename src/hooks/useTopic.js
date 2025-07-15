import { getTopics } from "@/services/topicService";
import { useQuery } from "@tanstack/react-query";

export const useTopic = () => {
  return useQuery({
    queryKey: ["topics"],
    queryFn: () => getTopics(),
  });
};
