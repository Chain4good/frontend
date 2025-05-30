import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import { Heart, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import CommentForm from "./CommentForm";
import useUserStore from "@/hooks/useUserStore";
import { toast } from "sonner";

const Comment = ({
  comment,
  onReply,
  level = 0,
  parentUser = null,
  activeReplyId,
  setActiveReplyId,
  maxReplies = 2,
  showAllReplies = false,
}) => {
  const [showAll, setShowAll] = useState(false);
  const { user } = useUserStore();
  const isReplyFormVisible = activeReplyId === comment.id;

  // Filter replies based on showAll state
  const displayedReplies =
    showAll || showAllReplies
      ? comment.replies
      : comment.replies?.slice(0, maxReplies);

  const hasMoreReplies = !showAll && comment.replies?.length > maxReplies;

  return (
    <>
      <div className={`flex gap-4 ${level > 0 ? "ml-12" : ""}`}>
        <Avatar>
          <AvatarImage src={comment.user.image} />
          <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold">{comment.user.name}</span>
                {comment.parentId && (
                  <span className="text-xs text-muted-foreground mx-2">
                    trả lời
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDistance(new Date(comment.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <p className="text-sm">
              {level > 1 && parentUser && (
                <span className="text-primary font-medium">
                  @{parentUser.name}{" "}
                </span>
              )}
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Heart className="w-4 h-4 mr-2" />
              {comment._count.Like}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => {
                if (!user) return toast.warning("Vui lòng đăng nhập!");
                setActiveReplyId(isReplyFormVisible ? null : comment.id);
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Trả lời
            </Button>
          </div>
        </div>
      </div>

      {isReplyFormVisible && (
        <div className={level > 0 ? "ml-24" : "ml-12"}>
          <CommentForm
            parentId={comment.id}
            onSubmit={(content) => {
              onReply(content, comment.id);
              setActiveReplyId(null); // Close form after submitting
            }}
            autoFocus
            user={user}
            onCancel={() => setActiveReplyId(null)}
          />
        </div>
      )}

      {/* Show replies */}
      {displayedReplies?.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          onReply={onReply}
          level={level + 1}
          parentUser={comment.user}
          activeReplyId={activeReplyId}
          setActiveReplyId={setActiveReplyId}
          showAllReplies={showAll}
        />
      ))}

      {/* Show "View All" button if there are more replies */}
      {hasMoreReplies && (
        <div className={`ml-12 mt-2`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
            onClick={() => setShowAll(true)}
          >
            Xem tất cả {comment.replies.length} câu trả lời
          </Button>
        </div>
      )}
    </>
  );
};

const CommentSkeleton = () => {
  return (
    <div className="flex gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="bg-muted p-4 rounded-lg">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-medium mb-2">Chưa có bình luận nào</h3>
      <p className="text-sm text-muted-foreground">
        Hãy là người đầu tiên bình luận về chiến dịch này
      </p>
    </div>
  );
};

const CommentBox = ({
  comments = [],
  onAddComment,
  onReply,
  isLoading = false,
  isSubmitting = false,
}) => {
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);

  const commentMap = comments.reduce((acc, comment) => {
    acc[comment.id] = {
      ...comment,
      replies: [],
    };
    return acc;
  }, {});

  comments.forEach((comment) => {
    if (comment.parentId) {
      const parent = commentMap[comment.parentId];
      if (parent) {
        parent.replies.push(commentMap[comment.id]);
      }
    }
  });

  const topLevelComments = Object.values(commentMap).filter(
    (comment) => !comment.parentId
  );

  const displayedComments = showAllComments
    ? topLevelComments
    : topLevelComments.slice(0, 5);

  const hasMoreComments = !showAllComments && topLevelComments.length > 5;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!comments.length) {
    return (
      <>
        <CommentForm
          onSubmit={(content) => onAddComment(content)}
          isLoading={isSubmitting}
        />
        <EmptyState />;
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Always show CommentForm at the top */}
      <CommentForm
        onSubmit={(content) => onAddComment(content)}
        isLoading={isSubmitting}
      />

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      ) : !comments.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {displayedComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={onReply}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              maxReplies={2}
            />
          ))}

          {hasMoreComments && (
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80"
                onClick={() => setShowAllComments(true)}
              >
                Xem tất cả {topLevelComments.length} bình luận
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentBox;
