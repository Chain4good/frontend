import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getFileInfo } from "@/lib/utils";
import { getCampaignProgress } from "@/services/campaignService";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import { CheckCircle2, X, ClipboardList } from "lucide-react"; // Thêm ClipboardList icon
import { Button } from "@/components/ui/button";

const EmptyState = () => {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <div className="flex justify-center mb-4">
        <ClipboardList className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-medium mb-2">Chưa có cập nhật</h3>
      <p className="text-sm text-muted-foreground">
        Chưa có tiến trình nào được cập nhật cho chiến dịch này
      </p>
    </div>
  );
};

const ProgressList = ({ campaignId }) => {
  const [selectedPreview, setSelectedPreview] = useState(null);
  const { data: progressList, isLoading } = useQuery({
    queryKey: ["campaign-progress", campaignId],
    queryFn: () => getCampaignProgress(campaignId),
  });

  const handlePreview = (url) => {
    setSelectedPreview(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Tiến trình chiến dịch</h3>
        <div className="animate-pulse space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/6" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Tiến trình chiến dịch</h3>
        {!progressList?.length ? (
          <EmptyState />
        ) : (
          <div className="relative space-y-8">
            {/* Thêm line xuyên suốt */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

            {progressList?.map((progress, index) => (
              <div key={progress.id} className="relative pl-12 pb-8">
                {/* Circle và line */}
                <div className="absolute left-0 flex items-center justify-center w-8 h-8 bg-background border-2 border-primary rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium text-lg">{progress.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(progress.createdAt), "PPP", {
                        locale: vi,
                      })}
                    </p>
                  </div>

                  <div className="pl-4 border-l-2 border-muted">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: progress.description }}
                    />

                    {/* Images */}
                    {progress.images?.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {progress.images.map((image) => (
                          <div key={image} className="relative group">
                            <img
                              src={image}
                              alt="Progress"
                              className="rounded-lg object-cover aspect-video cursor-pointer group-hover:opacity-90 transition-opacity"
                              onClick={() => handlePreview(image)}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm">
                                Xem ảnh
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Documents */}
                    {progress.documents?.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">
                          Tài liệu đính kèm:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {progress.documents.map((doc) => {
                            const {
                              icon: Icon,
                              color,
                              fileName,
                              type,
                            } = getFileInfo(doc);
                            return (
                              <div
                                key={doc}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border border-border"
                                onClick={() =>
                                  type === "image"
                                    ? handlePreview(doc)
                                    : window.open(doc, "_blank")
                                }
                              >
                                <Icon className={`w-5 h-5 ${color}`} />
                                <span className="text-sm truncate flex-1">
                                  {fileName}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={!!selectedPreview}
        onOpenChange={() => setSelectedPreview(null)}
      >
        <DialogContent className="max-w-[90vw] h-[90vh] p-0">
          <div className="relative h-full">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-50"
              onClick={() => setSelectedPreview(null)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Preview content */}
            <div className="h-full flex items-center justify-center bg-black/50">
              {getFileInfo(selectedPreview)?.type === "image" ? (
                <img
                  src={selectedPreview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : getFileInfo(selectedPreview)?.type === "video" ? (
                <video controls className="max-h-full max-w-full">
                  <source
                    src={selectedPreview}
                    type={`video/${getFileInfo(selectedPreview)?.extension}`}
                  />
                </video>
              ) : getFileInfo(selectedPreview)?.type === "audio" ? (
                <div className="w-full max-w-xl p-4 bg-background rounded-lg">
                  <audio controls className="w-full">
                    <source src={selectedPreview} type="audio/mpeg" />
                  </audio>
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProgressList;
