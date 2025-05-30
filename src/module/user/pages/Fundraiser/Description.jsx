import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./editor.css"; // Tạo file CSS riêng
import useCampaign from "@/hooks/useCampaign";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Description = () => {
  const { newCampaign, changeCampaignValue } = useCampaign();
  const location = useLocation();
  const error = location.state?.error;

  return (
    <div className="container mx-auto space-y-6 md:p-20 p-0">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div>
        <h2 className="font-semibold text-xl">Chi tiết chiến dịch gây quỹ</h2>
        <p className="text-muted-foreground">
          Hãy mô tả chi tiết về mục đích và kế hoạch sử dụng quỹ của bạn
        </p>
      </div>
      <div>
        <Label className="pb-1">Tiêu đề</Label>
        <Input
          size="lg"
          placeholder="Tiêu đề"
          value={newCampaign.title}
          onChange={(e) => changeCampaignValue("title", e.target.value)}
        />
      </div>
      <div>
        <Label className="pb-1">Mô tả</Label>
        <CKEditor
          editor={ClassicEditor}
          data={newCampaign.description}
          onChange={(event, editor) => {
            const data = editor.getData();
            changeCampaignValue("description", data);
          }}
          config={{
            toolbar: {
              items: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "outdent",
                "indent",
                "|",
                "blockQuote",
                "insertTable",
                "mediaEmbed",
                "undo",
                "redo",
              ],
              shouldNotGroupWhenFull: true,
            },
            placeholder: "Nhập nội dung mô tả chi tiết...",
            heading: {
              options: [
                {
                  model: "paragraph",
                  title: "Paragraph",
                  class: "ck-heading_paragraph",
                },
                {
                  model: "heading1",
                  view: "h1",
                  title: "Heading 1",
                  class: "ck-heading_heading1",
                },
                {
                  model: "heading2",
                  view: "h2",
                  title: "Heading 2",
                  class: "ck-heading_heading2",
                },
              ],
            },
          }}
        />
      </div>
    </div>
  );
};

export default Description;
