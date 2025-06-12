import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import useUserStore from "@/hooks/useUserStore";

const CommentForm = ({
  onSubmit,
  isLoading = false,
  parentId = null,
  autoFocus = false,
  onCancel = null,
}) => {
  const [content, setContent] = useState("");

  const { user } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) return toast.error("Vui lòng đăng nhập!");
    if (!content.trim()) return;

    onSubmit(content, parentId);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Viết câu trả lời..." : "Viết bình luận..."}
        className="min-h-[100px]"
        autoFocus={autoFocus}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Hủy
          </Button>
        )}
        <Button type="submit" disabled={!content.trim() || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {parentId ? "Trả lời" : "Bình luận"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
