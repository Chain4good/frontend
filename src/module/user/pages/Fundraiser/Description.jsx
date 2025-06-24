import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./editor.css";
import useCampaign from "@/hooks/useCampaign";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  FileText,
  Edit3,
  Eye,
  Wand2,
  Sparkles,
  Check,
  Info,
  Upload,
  Image as ImageIcon,
  Type,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { motion } from "framer-motion";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="container mx-auto px-6 md:px-10 py-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div variants={item} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Nội dung chiến dịch
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
          Chi tiết chiến dịch gây quỹ
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hãy mô tả chi tiết về mục đích và kế hoạch sử dụng quỹ để thu hút
          người quyên góp
        </p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div variants={item}>
          <Alert
            variant="destructive"
            className="mb-6 border-destructive/50 bg-destructive/10"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Có lỗi xảy ra</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div variants={item} className="max-w-5xl mx-auto">
        <Tabs defaultValue="edit" className="w-full">
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger
                value="edit"
                className="flex items-center gap-2 font-medium"
              >
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="flex items-center gap-2 font-medium"
              >
                <Eye className="w-4 h-4" />
                Xem trước
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="edit" className="space-y-8">
            {/* Title Section */}
            <motion.div
              variants={item}
              className="relative p-6 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-4 right-4">
                <motion.div
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Type className="w-5 h-5 text-primary" />
                </motion.div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <Label className="text-lg font-semibold text-gray-900">
                  Tiêu đề chiến dịch
                </Label>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Input
                  size="lg"
                  placeholder="Nhập tiêu đề ấn tượng cho chiến dịch..."
                  value={newCampaign.title}
                  onChange={(e) => changeCampaignValue("title", e.target.value)}
                  className="text-lg h-12 border-2 hover:border-primary/50 focus:border-primary transition-colors"
                />
              </motion.div>

              {newCampaign.title && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Check className="w-4 h-4" />
                    <span>Tiêu đề: {newCampaign.title.length} ký tự</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Description Section */}
            <motion.div
              variants={item}
              className="relative p-6 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-4 right-4">
                <motion.div
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Edit3 className="w-5 h-5 text-primary" />
                </motion.div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <Label className="text-lg font-semibold text-gray-900">
                    Mô tả chi tiết
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Sử dụng editor để tạo nội dung phong phú với hình ảnh và
                    định dạng
                  </p>
                </div>
              </div>

              <motion.div
                className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-primary/50 transition-colors duration-300"
                whileHover={{ scale: 1.005 }}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={newCampaign.description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    changeCampaignValue("description", data);
                  }}
                  config={{
                    extraPlugins: [uploadPlugin],
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
                        "uploadImage",
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
                    placeholder:
                      "Hãy chia sẻ câu chuyện, mục đích và kế hoạch sử dụng quỹ một cách chi tiết...",
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
              </motion.div>

              {/* Editor Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200/50"
              >
                <div className="flex items-center gap-4 text-sm text-blue-800">
                  <div className="flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Tải ảnh</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>Media</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Type className="w-3 h-3" />
                    <span>Định dạng</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <motion.div
              variants={item}
              className="relative p-8 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 shadow-lg"
            >
              <div className="absolute top-4 right-4">
                <motion.div
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Eye className="w-5 h-5 text-primary" />
                </motion.div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Tiêu đề</h3>
                  </div>
                  <div className="prose max-w-none">
                    {newCampaign.title ? (
                      <motion.h1
                        className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {newCampaign.title}
                      </motion.h1>
                    ) : (
                      <p className="text-muted-foreground italic p-4 border-2 border-dashed rounded-lg">
                        Chưa có tiêu đề...
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Mô tả</h3>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    {newCampaign.description ? (
                      <motion.div
                        className="bg-white rounded-lg p-6 border shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        dangerouslySetInnerHTML={{
                          __html: newCampaign.description,
                        }}
                      />
                    ) : (
                      <p className="text-muted-foreground italic p-6 border-2 border-dashed rounded-lg">
                        Chưa có nội dung mô tả...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* AI Optimization Section */}
        <motion.div variants={item} className="flex justify-end mt-8">
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="gap-2 h-12 px-6 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  {isOptimizing ? "Đang tối ưu..." : "Tối ưu nội dung bằng AI"}
                </Button>
              </motion.div>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Nội dung đã được tối ưu bằng AI
                </DialogTitle>
                <DialogDescription className="text-base">
                  {isOptimizing
                    ? "Đang phân tích và tối ưu nội dung của bạn..."
                    : "AI đã tối ưu nội dung để thu hút người quyên góp hiệu quả hơn. Bạn có thể áp dụng hoặc giữ nguyên nội dung cũ."}
                </DialogDescription>
              </DialogHeader>

              {isOptimizing ? (
                <div className="py-12 flex flex-col items-center gap-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
                  />
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">
                      Đang tối ưu nội dung bằng AI...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quá trình này có thể mất vài giây
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-lg">
                        Tiêu đề đã tối ưu
                      </h3>
                    </div>
                    <div className="p-4 border-2 border-primary/20 rounded-xl bg-primary/5">
                      <p className="text-lg font-medium">
                        {optimizedData?.optimizedTitle}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-lg">Mô tả đã tối ưu</h3>
                    </div>
                    <div
                      className="p-4 border-2 border-primary/20 rounded-xl bg-primary/5 prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: optimizedData?.optimizedDescription,
                      }}
                    />
                  </div>
                </div>
              )}

              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Giữ nội dung cũ
                </Button>
                <Button
                  onClick={handleApplyOptimized}
                  disabled={isOptimizing}
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  Áp dụng nội dung mới
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          variants={item}
          className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-primary/5 rounded-2xl border border-blue-200/50"
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Mẹo viết nội dung thu hút
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Kể câu chuyện:</strong> Chia sẻ hoàn cảnh cụ thể và
                  cảm xúc thật
                </li>
                <li>
                  • <strong>Minh bạch:</strong> Giải thích rõ cách sử dụng từng
                  khoản tiền
                </li>
                <li>
                  • <strong>Thêm hình ảnh:</strong> Visual giúp tăng tính thuyết
                  phục
                </li>
                <li>
                  • <strong>Gọi hành động:</strong> Khuyến khích người đọc quyên
                  góp
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Description;
