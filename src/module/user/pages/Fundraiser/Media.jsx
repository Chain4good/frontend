import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2, AlertCircle } from "lucide-react"; // Thêm Loader2
import { useFormContext } from "react-hook-form";
import useCampaign from "@/hooks/useCampaign";
import { uploadFile } from "@/services/uploadService";
import { createCover } from "@/services/coverService";
import { validateFile } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Media = () => {
  const [preview, setPreview] = useState({
    cover: null,
    images: [],
  });
  const [loading, setLoading] = useState({
    cover: false,
    images: false,
  });
  const { newCampaign, changeCampaignValue } = useCampaign();
  const location = useLocation();
  const error = location.state?.error;

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
        }
      } catch (error) {
        console.error("Error uploading cover:", error);
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
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        setLoading((prev) => ({ ...prev, images: false }));
      }
    }
  };

  const removeImage = (index) => {
    // const currentImages = watch("images") || [];
    // const newImages = currentImages.filter((_, i) => i !== index);
    // setValue("images", newImages);

    setPreview((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const renderPreview = (file) => {
    if (file?.startsWith("data:video") || file?.match(/\.(mp4|webm|ogg)$/i)) {
      return (
        <video className="w-full h-full object-cover rounded-lg" controls>
          <source src={file} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <img
        src={file}
        alt="Preview"
        className="w-full h-full object-cover rounded-lg"
      />
    );
  };

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
        <h2 className="font-semibold text-xl">Hình ảnh cho chiến dịch</h2>
        <p className="text-muted-foreground">
          Thêm hình ảnh để mọi người hiểu rõ hơn về chiến dịch của bạn
        </p>
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-4">
        <Label>Ảnh bìa</Label>
        <div className="relative">
          <Input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            id="cover-upload"
            onChange={handleCoverChange}
            disabled={loading.cover}
          />
          <Label
            htmlFor="cover-upload"
            className="block w-full aspect-video cursor-pointer border-2 border-dashed rounded-lg hover:border-primary transition-colors"
          >
            {loading.cover ? (
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm text-gray-500">Đang tải lên...</span>
              </div>
            ) : preview.cover ? (
              renderPreview(preview.cover)
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <ImagePlus className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Click để tải lên ảnh bìa
                </span>
              </div>
            )}
          </Label>
        </div>
      </div>

      {/* Multiple Images Upload */}
      <div className="space-y-4">
        <Label>Hình ảnh bổ sung</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {preview.images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              {renderPreview(image)}
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
          <Input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            id="images-upload"
            multiple
            onChange={handleImagesChange}
            disabled={loading.images}
          />
          <Label
            htmlFor="images-upload"
            className="block aspect-square cursor-pointer border-2 border-dashed rounded-lg hover:border-primary transition-colors"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              {loading.images ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              ) : (
                <ImagePlus className="w-8 h-8 text-gray-400" />
              )}
              <span className="text-sm text-gray-500">
                {loading.images ? "Đang tải lên..." : "Thêm hình ảnh"}
              </span>
            </div>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default Media;
