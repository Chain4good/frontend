import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostBySlug } from "@/services/postService";

const Post = () => {
  const { slug } = useParams();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8" id="post">
      <p className="text-muted-foreground mb-4">{post?.data?.topic?.name}</p>
      {/* <h1 className="text-4xl font-heading font-bold mb-4">
        {post?.data?.title}
      </h1> */}
      {/* <div className="aspect-video mb-6">
        <img
          src={post?.data?.thumbnail}
          alt={post?.data?.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div> */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post?.data?.content }}
      />
    </div>
  );
};

export default Post;
