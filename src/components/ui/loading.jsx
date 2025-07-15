import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ message = "Đang tải...", className = "" }) => {
  return (
    <div className="container mx-auto min-h-[400px] flex items-center justify-center">
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">{message}</p>
      </div>
    </div>
  );
};
