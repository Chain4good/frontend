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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DOMPurify from "dompurify";
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
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
                <TabsTrigger value="preview">Xem trước</TabsTrigger>
              </TabsList>

              <TabsContent value="edit">
                <CKEditor
                  editor={ClassicEditor}
                  data={progress.description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setProgress({ ...progress, description: data });
                  }}
                  config={{
                    toolbar: {
                      items: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "outdent",
                        "indent",
                        "|",
                        "blockQuote",
                        "insertTable",
                        "undo",
                        "redo",
                      ],
                    },
                  }}
                />
              </TabsContent>

              <TabsContent value="preview" className="border rounded-lg p-4">
                {progress.description ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(progress.description),
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground italic">
                    Chưa có nội dung...
                  </p>
                )}
              </TabsContent>
            </Tabs>
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
