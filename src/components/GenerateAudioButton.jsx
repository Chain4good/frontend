import { Button } from "@/components/ui/button";
import { Loader2, Volume2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateCampaignAudio } from "@/services/aiService";
import { useQueryClient } from "@tanstack/react-query";

const GenerateAudioButton = ({ campaignId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const handleGenerateAudio = async () => {
    try {
      setIsGenerating(true);
      await generateCampaignAudio(campaignId);

      toast.success("Audio đã được tạo thành công!");
    } catch (error) {
      toast.error("Không thể tạo audio: " + error.message);
    } finally {
      await queryClient.refetchQueries({
        queryKey: ["campaign", campaignId],
        exact: true,
        type: "active",
      });
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateAudio}
      variant="outline"
      size="sm"
      disabled={isGenerating}
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tạo audio...
        </>
      ) : (
        <>
          <Volume2Icon className="h-4 w-4" />
          Tạo cuộc trò chuyện
        </>
      )}
    </Button>
  );
};

export default GenerateAudioButton;
