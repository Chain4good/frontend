import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./editor.css";
import useCampaign from "@/hooks/useCampaign";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { optimizeCampaign } from "@/services/aiService";
import { uploadFile } from "@/services/uploadService";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Description = () => {
  const { newCampaign, changeCampaignValue } = useCampaign();
  const location = useLocation();
  const error = location.state?.error;
  const [optimizedData, setOptimizedData] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleOptimize = async () => {
    if (!newCampaign.title || !newCampaign.description) {
      toast.error("Vui lòng nhập tiêu đề và mô tả trước khi tối ưu");
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await optimizeCampaign({
        title: newCampaign.title,
        description: newCampaign.description,
      });
      setOptimizedData(result);
      setShowDialog(true);
    } catch (error) {
      toast.error("Không thể tối ưu: " + error.message);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimized = () => {
    if (optimizedData) {
      changeCampaignValue("title", optimizedData.optimizedTitle);
      changeCampaignValue("description", optimizedData.optimizedDescription);
      setShowDialog(false);
      toast.success("Đã áp dụng nội dung tối ưu");
    }
  };

  function uploadAdapter(loader) {
    return {
      upload: () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          try {
            const file = await loader.file;
            const result = await uploadFile(file);
            resolve({
              default: result.url,
            });
          } catch (error) {
            reject(error);
            toast.error("Không thể tải ảnh lên: " + error.message);
          }
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div className="container mx-auto space-y-6 md:p-20 p-0">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <h2 className="font-semibold text-xl">Chi tiết chiến dịch gây quỹ</h2>
        <p className="text-muted-foreground">
          Hãy mô tả chi tiết về mục đích và kế hoạch sử dụng quỹ của bạn
        </p>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
          <TabsTrigger value="preview">Xem trước</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <div>
            <Label className="pb-1">Tiêu đề</Label>
            <Input
              size="lg"
              placeholder="Tiêu đề"
              value={newCampaign.title}
              onChange={(e) => changeCampaignValue("title", e.target.value)}
            />
          </div>
          <div>
            <Label className="pb-1">Mô tả</Label>
            <CKEditor
              editor={ClassicEditor}
              data={newCampaign.description}
              onChange={(event, editor) => {
                const data = editor.getData();
                changeCampaignValue("description", data);
              }}
              config={{
                extraPlugins: [uploadPlugin], // Thêm plugin upload
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
                    "uploadImage", // Thêm nút upload ảnh
                    "mediaEmbed",
                    "|",
                    "outdent",
                    "indent",
                    "|",
                    "blockQuote",
                    "insertTable",
                    "undo",
                    "redo",
                  ],
                  shouldNotGroupWhenFull: true,
                },
                image: {
                  toolbar: [
                    "imageStyle:inline",
                    "imageStyle:block",
                    "imageStyle:side",
                    "|",
                    "toggleImageCaption",
                    "imageTextAlternative",
                  ],
                  upload: {
                    types: ["jpeg", "png", "gif", "webp"],
                  },
                },
                placeholder: "Nhập nội dung mô tả chi tiết...",
                heading: {
                  options: [
                    {
                      model: "paragraph",
                      title: "Paragraph",
                      class: "ck-heading_paragraph",
                    },
                    {
                      model: "heading1",
                      view: "h1",
                      title: "Heading 1",
                      class: "ck-heading_heading1",
                    },
                    {
                      model: "heading2",
                      view: "h2",
                      title: "Heading 2",
                      class: "ck-heading_heading2",
                    },
                  ],
                },
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="rounded-lg border p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Tiêu đề</h3>
              <div className="prose max-w-none">
                {newCampaign.title || (
                  <p className="text-muted-foreground italic">
                    Chưa có tiêu đề...
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
              <div className="prose max-w-none">
                {newCampaign.description ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: newCampaign.description,
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground italic">
                    Chưa có nội dung mô tả...
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-4">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleOptimize}
              disabled={isOptimizing}
            >
              <Wand2 className="w-4 h-4" />
              {isOptimizing ? "Đang tối ưu..." : "Tối ưu nội dung"}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nội dung đã được tối ưu</DialogTitle>
              <DialogDescription>
                {isOptimizing
                  ? "Đang tối ưu nội dung..."
                  : "Xem trước nội dung đã được AI tối ưu. Bạn có thể áp dụng hoặc giữ nguyên nội dung cũ."}
              </DialogDescription>
            </DialogHeader>

            {isOptimizing ? (
              <div className="py-8 flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">
                  Đang tối ưu nội dung bằng AI...
                </p>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Tiêu đề</h3>
                  <div className="p-4 border rounded-lg bg-muted">
                    {optimizedData?.optimizedTitle}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Mô tả</h3>
                  <div
                    className="p-4 border rounded-lg bg-muted"
                    dangerouslySetInnerHTML={{
                      __html: optimizedData?.optimizedDescription,
                    }}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleApplyOptimized} disabled={isOptimizing}>
                Áp dụng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Description;
