import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

export default function ReadMore({ text, maxLength = 300, className }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sanitize HTML content
  const sanitizedHtml = DOMPurify.sanitize(text);

  // Function to truncate HTML string
  const truncateHtml = (html, length) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent;
    if (text.length <= length) return html;

    let truncated = text.slice(0, length);
    return `<p>${truncated}...</p>`;
  };

  if (text.length <= maxLength) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn("relative", !isExpanded && "max-h-40 overflow-hidden")}
      >
        <div
          className={cn("transition-all duration-300", className)}
          dangerouslySetInnerHTML={{
            __html: isExpanded
              ? sanitizedHtml
              : truncateHtml(sanitizedHtml, maxLength),
          }}
        />

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
