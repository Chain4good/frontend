import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCampaign from "@/hooks/useCampaign";
import { validateFile } from "@/lib/utils";
import { createCover } from "@/services/coverService";
import { uploadFile } from "@/services/uploadService";
import {
  AlertCircle,
  ImagePlus,
  Loader2,
  X,
  Camera,
  Film,
  Upload,
  Image as ImageIcon,
  Grid3X3,
  Sparkles,
  Check,
  Info,
  Play,
  Eye,
  ZoomIn,
} from "lucide-react";
import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Media = () => {
  const [preview, setPreview] = useState({
    cover: null,
    images: [],
  });
  const [loading, setLoading] = useState({
    cover: false,
    images: false,
  });
  const [isDragging, setIsDragging] = useState({
    cover: false,
    images: false,
  });

  const { changeCampaignValue } = useCampaign();
  const location = useLocation();
  const error = location.state?.error;
  const coverInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  const handleCoverChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      try {
        setLoading((prev) => ({ ...prev, cover: true }));
        const { url } = await uploadFile(file);
        if (url) {
          const isVideo = file.type.startsWith("video/");
          const mediaType = isVideo ? "VIDEO" : "IMAGE";

          const data = await createCover(url, mediaType);
          changeCampaignValue("coverId", data.id);
          setPreview((prev) => ({
            ...prev,
            cover: url,
          }));
          toast.success("Đã tải lên ảnh bìa thành công!");
        }
      } catch (error) {
        console.error("Error uploading cover:", error);
        toast.error("Không thể tải lên ảnh bìa: " + error.message);
      } finally {
        setLoading((prev) => ({ ...prev, cover: false }));
      }
    }
  };

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      try {
        setLoading((prev) => ({ ...prev, images: true }));
        const uploadPromises = files.map((file) => uploadFile(file));
        const results = await Promise.all(uploadPromises);
        setPreview((prev) => ({
          ...prev,
          images: [...prev.images, ...results.map((result) => result.url)],
        }));
        changeCampaignValue("images", [
          ...preview.images,
          ...results.map((result) => result.url),
        ]);
        toast.success(`Đã tải lên ${files.length} hình ảnh thành công!`);
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error("Không thể tải lên hình ảnh: " + error.message);
      } finally {
        setLoading((prev) => ({ ...prev, images: false }));
      }
    }
  };

  const removeImage = (index) => {
    const newImages = preview.images.filter((_, i) => i !== index);
    setPreview((prev) => ({
      ...prev,
      images: newImages,
    }));
    changeCampaignValue("images", newImages);
    toast.success("Đã xóa hình ảnh");
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    setIsDragging((prev) => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    setIsDragging((prev) => ({ ...prev, [type]: false }));
  };

  const handleDrop = async (e, type) => {
    e.preventDefault();
    setIsDragging((prev) => ({ ...prev, [type]: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (type === "cover") {
        const file = files[0];
        if (validateFile(file)) {
          // Simulate file input change
          const input =
            type === "cover" ? coverInputRef.current : imagesInputRef.current;
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;

          if (type === "cover") {
            handleCoverChange({ target: { files: [file] } });
          }
        }
      } else {
        const validFiles = files.filter(validateFile);
        if (validFiles.length > 0) {
          const input = imagesInputRef.current;
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          input.files = dataTransfer.files;

          handleImagesChange({ target: { files: validFiles } });
        }
      }
    }
  };

  const renderPreview = (file) => {
    const isVideo =
      file?.startsWith("data:video") || file?.match(/\.(mp4|webm|ogg)$/i);

    if (isVideo) {
      return (
        <div className="relative w-full h-full group">
          <video className="w-full h-full object-cover rounded-xl" muted>
            <source src={file} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
            <Play className="w-8 h-8 text-white" />
          </div>
          <div className="absolute top-2 left-2">
            <div className="bg-black/50 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Film className="w-3 h-3" />
              Video
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full group">
        <img
          src={file}
          alt="Preview"
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
          <ZoomIn className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  };

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
          <Camera className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Media cho chiến dịch
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
          Hình ảnh cho chiến dịch
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Thêm hình ảnh và video ấn tượng để thu hút người quyên góp và kể câu
          chuyện của bạn
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

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Cover Image Upload */}
        <motion.div variants={item} className="space-y-4">
          <div className="relative p-6 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-4 right-4">
              <motion.div
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Camera className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <Label className="text-lg font-semibold text-gray-900">
                  Ảnh bìa chiến dịch
                </Label>
                <p className="text-sm text-muted-foreground">
                  Chọn hình ảnh hoặc video làm ảnh bìa chính cho chiến dịch
                  (16:9)
                </p>
              </div>
            </div>

            <div className="relative">
              <Input
                ref={coverInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                id="cover-upload"
                onChange={handleCoverChange}
                disabled={loading.cover}
              />

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onDragOver={(e) => handleDragOver(e, "cover")}
                onDragLeave={(e) => handleDragLeave(e, "cover")}
                onDrop={(e) => handleDrop(e, "cover")}
                className={`
                  relative w-full aspect-video cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden
                  ${
                    isDragging.cover
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-gray-300 hover:border-primary/50"
                  }
                  ${preview.cover ? "border-solid border-primary/30" : ""}
                `}
                onClick={() => !loading.cover && coverInputRef.current?.click()}
              >
                {loading.cover ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 bg-primary/5">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="w-12 h-12 text-primary" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-primary">
                        Đang tải lên ảnh bìa...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vui lòng đợi
                      </p>
                    </div>
                  </div>
                ) : preview.cover ? (
                  <div className="relative h-full">
                    {renderPreview(preview.cover)}
                    <div className="absolute top-4 left-4">
                      <div className="bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        <Check className="w-3 h-3" />
                        Ảnh bìa
                      </div>
                    </div>
                    <motion.button
                      className="absolute top-4 right-4 w-8 h-8 bg-destructive/90 text-white rounded-full flex items-center justify-center hover:bg-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview((prev) => ({ ...prev, cover: null }));
                        changeCampaignValue("coverId", null);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
                    <motion.div
                      className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Upload className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium text-gray-900">
                        {isDragging.cover
                          ? "Thả file vào đây"
                          : "Tải lên ảnh bìa"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Kéo thả hoặc click để chọn file • PNG, JPG, MP4 tối đa
                        10MB
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>Hình ảnh</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        <span>Video</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Multiple Images Upload */}
        <motion.div variants={item} className="space-y-4">
          <div className="relative p-6 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-4 right-4">
              <motion.div
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Grid3X3 className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <Label className="text-lg font-semibold text-gray-900">
                  Hình ảnh bổ sung
                </Label>
                <p className="text-sm text-muted-foreground">
                  Thêm nhiều hình ảnh để mô tả chi tiết về chiến dịch (
                  {preview.images.length} ảnh)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {preview.images.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="relative h-full border-2 border-primary/20 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                    {renderPreview(image)}
                    <motion.button
                      className="absolute top-2 right-2 w-6 h-6 bg-destructive/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      onClick={() => removeImage(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                    <div className="absolute bottom-2 left-2">
                      <div className="bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add more images button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onDragOver={(e) => handleDragOver(e, "images")}
                onDragLeave={(e) => handleDragLeave(e, "images")}
                onDrop={(e) => handleDrop(e, "images")}
                className={`
                  relative aspect-square cursor-pointer border-2 border-dashed rounded-xl transition-all duration-300 group
                  ${
                    isDragging.images
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-gray-300 hover:border-primary/50"
                  }
                `}
                onClick={() =>
                  !loading.images && imagesInputRef.current?.click()
                }
              >
                <Input
                  ref={imagesInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  id="images-upload"
                  multiple
                  onChange={handleImagesChange}
                  disabled={loading.images}
                />

                <div className="flex flex-col items-center justify-center h-full space-y-2 p-4">
                  {loading.images ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="w-8 h-8 text-primary" />
                      </motion.div>
                      <span className="text-xs text-primary font-medium">
                        Đang tải...
                      </span>
                    </>
                  ) : (
                    <>
                      <motion.div
                        className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <ImagePlus className="w-4 h-4 text-primary" />
                      </motion.div>
                      <span className="text-xs text-gray-500 text-center">
                        {isDragging.images ? "Thả ảnh vào đây" : "Thêm ảnh"}
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {preview.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Check className="w-4 h-4" />
                  <span>Đã tải lên {preview.images.length} hình ảnh</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          variants={item}
          className="p-6 bg-gradient-to-r from-blue-50 to-primary/5 rounded-2xl border border-blue-200/50"
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Mẹo chọn hình ảnh hiệu quả
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Ảnh bìa:</strong> Chọn ảnh chất lượng cao, tỷ lệ
                  16:9, thể hiện rõ mục đích
                </li>
                <li>
                  • <strong>Hình ảnh bổ sung:</strong> Thêm ảnh chứng minh, quá
                  trình thực hiện
                </li>
                <li>
                  • <strong>Chất lượng:</strong> Ảnh sáng, rõ nét, không mờ hoặc
                  bị méo
                </li>
                <li>
                  • <strong>Câu chuyện:</strong> Hình ảnh phải liên quan trực
                  tiếp đến chiến dịch
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Media;
