import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Flag } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createReport } from "@/services/reportService";
import { toast } from "sonner";
import { ReportType } from "@/constants/enums";

const ReportCampaignButton = ({ campaignId }) => {
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: submitReport, isPending } = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      toast.success("Báo cáo đã được gửi thành công!");
      setIsOpen(false);
      setContent("");
      setType("");
    },
    onError: (error) => {
      toast.error("Không thể gửi báo cáo: " + error.message);
    },
  });

  const handleSubmit = () => {
    if (!type) {
      toast.error("Vui lòng chọn loại báo cáo");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung báo cáo");
      return;
    }

    submitReport({
      campaignId: Number(campaignId),
      content: content.trim(),
      type,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Flag className="h-4 w-4" />
          Báo cáo chiến dịch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Báo cáo chiến dịch</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Loại báo cáo</Label>
            <RadioGroup
              value={type}
              onValueChange={setType}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportType.SPAM} id="spam" />
                <Label htmlFor="spam">Spam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportType.ILLEGAL} id="illegal" />
                <Label htmlFor="illegal">Vi phạm pháp luật</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung báo cáo</Label>
            <Textarea
              id="content"
              placeholder="Vui lòng mô tả chi tiết lý do bạn báo cáo chiến dịch này..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Đang gửi..." : "Gửi báo cáo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportCampaignButton;
