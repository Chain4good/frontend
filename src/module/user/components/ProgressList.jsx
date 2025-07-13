import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getFileInfo } from "@/lib/utils";
import { getCampaignProgress } from "@/services/campaignService";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import {
  CheckCircle2,
  X,
  ClipboardList,
  Download,
  ExternalLink,
  FileText,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const PDFPreview = ({ url, fileName }) => {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* PDF Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-destructive" />
          <span className="font-medium truncate">{fileName}</span>
          <Badge variant="secondary" className="text-xs">
            PDF
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(url, "_blank")}
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Mở mới
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName;
              link.click();
            }}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Tải về
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
          className="w-full h-full border-0"
          title={`PDF Preview: ${fileName}`}
        />
      </div>
    </div>
  );
};

const ProgressList = ({ campaignId }) => {
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  const { data: progressList, isLoading } = useQuery({
    queryKey: ["campaign-progress", campaignId],
    queryFn: () => getCampaignProgress(campaignId),
  });

  const handlePreview = (url) => {
    const fileInfo = getFileInfo(url);
    setSelectedPreview(url);
    setPreviewType(fileInfo.type);
  };

  const handleDocumentClick = (doc) => {
    const fileInfo = getFileInfo(doc);
    if (fileInfo.type === "pdf" || fileInfo.type === "image") {
      handlePreview(doc);
    } else {
      window.open(doc, "_blank");
    }
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
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

            {progressList?.map((progress) => (
              <div key={progress.id} className="relative pl-12 pb-8">
                {/* Timeline circle */}
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
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Documents */}
                    {progress.documents?.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Tài liệu đính kèm:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {progress.documents.map((doc) => {
                            const {
                              icon: Icon,
                              color,
                              fileName,
                              type,
                              extension,
                            } = getFileInfo(doc);

                            const isPDF = type === "pdf";
                            const isPreviewable = isPDF || type === "image";

                            return (
                              <div
                                key={doc}
                                className="group relative flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-pointer border border-border hover:border-primary/50 hover:shadow-sm"
                                onClick={() => handleDocumentClick(doc)}
                              >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50">
                                  <Icon className={`w-5 h-5 ${color}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {fileName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {extension?.toUpperCase()}
                                    </Badge>
                                    {isPDF && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        Preview
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {isPreviewable && (
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                )}
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
        onOpenChange={() => {
          setSelectedPreview(null);
          setPreviewType(null);
        }}
      >
        <DialogContent className="max-w-[95vw] h-[95vh] p-0">
          <div className="relative h-full">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => {
                setSelectedPreview(null);
                setPreviewType(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Preview content */}
            <div className="h-full">
              {previewType === "pdf" ? (
                <PDFPreview
                  url={selectedPreview}
                  fileName={
                    getFileInfo(selectedPreview)?.fileName || "document.pdf"
                  }
                />
              ) : previewType === "image" ? (
                <div className="h-full flex items-center justify-center bg-black/50">
                  <img
                    src={selectedPreview}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : previewType === "video" ? (
                <div className="h-full flex items-center justify-center bg-black/50">
                  <video controls className="max-h-full max-w-full">
                    <source
                      src={selectedPreview}
                      type={`video/${getFileInfo(selectedPreview)?.extension}`}
                    />
                  </video>
                </div>
              ) : previewType === "audio" ? (
                <div className="h-full flex items-center justify-center bg-muted/50">
                  <div className="w-full max-w-xl p-6 bg-background rounded-lg shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Audio File</h4>
                        <p className="text-sm text-muted-foreground">
                          {getFileInfo(selectedPreview)?.fileName}
                        </p>
                      </div>
                    </div>
                    <audio controls className="w-full">
                      <source src={selectedPreview} type="audio/mpeg" />
                    </audio>
                  </div>
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
