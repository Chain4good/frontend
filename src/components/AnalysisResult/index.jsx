import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain } from "lucide-react"; // Import thêm icon Brain

const AnalysisResult = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <Alert>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 animate-pulse text-primary" />
            <AlertTitle className="font-medium">
              AI đang phân tích chiến dịch...
            </AlertTitle>
          </div>

          <AlertDescription className="space-y-2">
            <div className="flex items-center gap-2">
              <strong className="min-w-16">Tóm tắt:</strong>
              <Skeleton className="h-4 flex-1" />
            </div>

            <div className="flex items-center gap-2">
              <strong className="min-w-16">Đánh giá:</strong>
              <Skeleton className="h-4 flex-1" />
            </div>
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  if (!analysis) return null;

  return (
    <Alert>
      <AlertTitle className="mb-2">Phân tích chiến dịch</AlertTitle>
      <AlertDescription className="space-y-2">
        <div className="flex gap-2">
          <strong className="min-w-16">Tóm tắt:</strong>
          <span>{analysis.summary}</span>
        </div>
        <div className="flex gap-2">
          <strong className="min-w-16">Đánh giá:</strong>
          <span>{analysis.analysis}</span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AnalysisResult;
