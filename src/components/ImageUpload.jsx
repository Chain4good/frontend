import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { uploadFile } from "@/services/uploadService";
import { validateFile } from "@/lib/utils";
import { toast } from "sonner";

export const ImageUpload = ({ value = [], onChange, multiple = false }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setLoading(true);
      const validFiles = files.filter((file) => validateFile(file));
      if (!validFiles.length) return;

      const uploadPromises = validFiles.map((file) => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      const urls = results.map((result) => result.url);

      if (multiple) {
        onChange([...value, ...urls]);
      } else {
        onChange([urls[0]]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Có lỗi xảy ra khi tải ảnh lên");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((image, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 w-6 h-6"
              onClick={() => removeImage(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            multiple={multiple}
            onChange={handleUpload}
            disabled={loading}
          />
          <Label
            htmlFor="image-upload"
            className="block aspect-square cursor-pointer border-2 border-dashed rounded-lg hover:border-primary transition-colors"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              ) : (
                <ImagePlus className="w-8 h-8 text-gray-400" />
              )}
              <span className="text-sm text-gray-500">
                {loading ? "Đang tải lên..." : "Thêm hình ảnh"}
              </span>
            </div>
          </Label>
        </div>
      </div>
    </div>
  );
};
