"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ReadMore({ text, maxLength = 300, className }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <p className={className}>{text}</p>;
  }

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn("relative", !isExpanded && "max-h-40 overflow-hidden")}
      >
        <p className={cn("transition-all duration-300", className)}>
          {isExpanded ? text : `${text.slice(0, maxLength)}...`}
        </p>

        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleReadMore}
        className="text-blue-500 hover:text-blue-700 p-0 h-auto font-medium"
      >
        {isExpanded ? "Ẩn bớt" : "Xem thêm"}
      </Button>
    </div>
  );
}
