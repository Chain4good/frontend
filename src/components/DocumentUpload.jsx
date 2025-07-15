import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, X, File } from "lucide-react";
import { useState } from "react";
import { uploadFile } from "@/services/uploadService";
import { toast } from "sonner";

export const DocumentUpload = ({ value = [], onChange, multiple = false }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setLoading(true);
      const uploadPromises = files.map((file) => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      const urls = results.map((result) => result.url);

      if (multiple) {
        onChange([...value, ...urls]);
      } else {
        onChange([urls[0]]);
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Có lỗi xảy ra khi tải tài liệu lên");
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = (index) => {
    const newDocs = value.filter((_, i) => i !== index);
    onChange(newDocs);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {value.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-2">
              <File className="w-5 h-5 text-blue-500" />
              <a
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                Tài liệu {index + 1}
              </a>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8"
              onClick={() => removeDocument(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div>
          <Input
            type="file"
            className="hidden"
            id="document-upload"
            multiple={multiple}
            onChange={handleUpload}
            disabled={loading}
          />
          <Label
            htmlFor="document-upload"
            className="block cursor-pointer border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              ) : (
                <FileUp className="w-8 h-8 text-gray-400" />
              )}
              <span className="text-sm text-gray-500">
                {loading ? "Đang tải lên..." : "Thêm tài liệu"}
              </span>
            </div>
          </Label>
        </div>
      </div>
    </div>
  );
};
