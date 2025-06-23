import { useState } from "react";
import { uploadFile } from "@/services/uploadService";
import { toast } from "sonner";

export const useImageUpload = (onSuccess) => {
  const [loading, setLoading] = useState({
    cover: false,
    avatar: false,
  });

  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Vui lòng tải lên file ảnh (JPG, PNG, GIF)");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("Kích thước ảnh phải nhỏ hơn 5MB");
      return false;
    }

    return true;
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;

    if (!validateImage(file)) return;

    try {
      setLoading((prev) => ({ ...prev, [type]: true }));
      const { url } = await uploadFile(file);
      await onSuccess({ [type === "avatar" ? "image" : "cover"]: url });
      return url;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error("Có lỗi xảy ra khi tải ảnh lên!");
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleCoverUpload = (e) =>
    handleImageUpload(e.target.files?.[0], "cover");
  const handleAvatarUpload = (e) =>
    handleImageUpload(e.target.files?.[0], "avatar");

  return {
    loading,
    handleCoverUpload,
    handleAvatarUpload,
  };
};
