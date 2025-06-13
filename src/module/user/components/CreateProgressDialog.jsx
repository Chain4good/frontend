import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  createCampaignProgress,
  getCampaignById,
} from "@/services/campaignService";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { DocumentUpload } from "@/components/DocumentUpload";
import useUserStore from "@/hooks/useUserStore";

const CreateProgressDialog = ({ campaignId }) => {
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState({
    title: "",
    description: "",
    images: [],
    documents: [],
  });

  const queryClient = useQueryClient();

  const { data: campaign } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => getCampaignById(campaignId),
  });

  const canUpdateProgress = user?.id === campaign?.userId;

  const { mutate: createProgress, isPending } = useMutation({
    mutationFn: (data) => createCampaignProgress(campaignId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["campaign-progress", campaignId]);
      setOpen(false);
      toast.success("Đã cập nhật tiến trình chiến dịch");
      setProgress({
        title: "",
        description: "",
        images: [],
        documents: [],
      });
    },
    onError: (error) => {
      toast.error("Không thể cập nhật: " + error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!progress.title || !progress.description) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    createProgress(progress);
  };

  if (!canUpdateProgress) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Cập nhật tiến trình</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật tiến trình chiến dịch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Tiêu đề cập nhật</Label>
            <Input
              value={progress.title}
              onChange={(e) =>
                setProgress({ ...progress, title: e.target.value })
              }
              placeholder="VD: Đã chuyển đến bệnh viện"
            />
          </div>

          <div className="space-y-2">
            <Label>Nội dung chi tiết</Label>
            <Textarea
              value={progress.description}
              onChange={(e) =>
                setProgress({ ...progress, description: e.target.value })
              }
              placeholder="Mô tả chi tiết về tiến trình..."
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh</Label>
            <ImageUpload
              value={progress.images}
              onChange={(urls) => setProgress({ ...progress, images: urls })}
              multiple
            />
          </div>

          <div className="space-y-2">
            <Label>Tài liệu đính kèm (tùy chọn)</Label>
            <DocumentUpload
              value={progress.documents}
              onChange={(urls) => setProgress({ ...progress, documents: urls })}
              multiple
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProgressDialog;
