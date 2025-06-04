import { getPosts } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";

export const usePost = (filters) => {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: () => getPosts(filters),
  });
};
