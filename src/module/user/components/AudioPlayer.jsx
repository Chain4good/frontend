import { Volume2Icon } from "lucide-react";

const AudioPlayer = ({ audioUrl }) => {
  return (
    <div className="bg-muted/30 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Volume2Icon className="w-5 h-5" />
        Cuộc trò chuyện phân tích về chiến dịch
      </h3>
      <audio controls className="w-full">
        <source src={audioUrl} type="audio/wav" />
        Trình duyệt của bạn không hỗ trợ phát audio.
      </audio>
    </div>
  );
};

export default AudioPlayer;
