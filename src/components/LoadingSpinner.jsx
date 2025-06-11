import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "Đang tải...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
