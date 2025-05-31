import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const AnalyzeButton = ({ onClick, isAnalyzing }) => {
  return (
    <Button
      onClick={onClick}
      disabled={isAnalyzing}
      variant="outline"
      className="w-full mb-4"
    >
      <Brain className={`mr-2 h-4 w-4 ${isAnalyzing ? "animate-pulse" : ""}`} />
      {isAnalyzing ? "Đang phân tích..." : "Phân tích bằng AI"}
    </Button>
  );
};

export default AnalyzeButton;
