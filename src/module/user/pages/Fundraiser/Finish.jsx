import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useCampaign from "@/hooks/useCampaign";
import useCreateStep from "@/hooks/useCreateStep"; // Thêm import này
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Finish = () => {
  const { newCampaign } = useCampaign();
  const navigate = useNavigate();
  const { steps, setStep } = useCreateStep(); // Thêm hook useCreateStep

  const validateCampaign = () => {
    const validations = [
      {
        field: "categoryId",
        message: "Vui lòng chọn danh mục chiến dịch",
        redirect: "/create/fundraiser/category",
      },
      {
        field: "countryId",
        message: "Vui lòng chọn quốc gia",
        redirect: "/create/fundraiser/category",
      },
      {
        field: "fundraiseTypeId",
        message: "Vui lòng chọn loại gây quỹ",
        redirect: "/create/fundraiser/type",
      },
      {
        field: "title",
        message: "Vui lòng nhập tiêu đề chiến dịch",
        redirect: "/create/fundraiser/description",
      },
      {
        field: "description",
        message: "Vui lòng nhập mô tả chiến dịch",
        redirect: "/create/fundraiser/description",
      },
      {
        field: "goal",
        message: "Vui lòng nhập mục tiêu gây quỹ",
        redirect: "/create/fundraiser/goal",
      },
      {
        field: "deadline",
        message: "Vui lòng chọn thời hạn gây quỹ",
        redirect: "/create/fundraiser/goal",
      },
      {
        field: "coverId",
        message: "Vui lòng tải lên ảnh bìa",
        redirect: "/create/fundraiser/media",
      },
    ];

    for (const validation of validations) {
      if (!newCampaign[validation.field]) {
        // Tìm index của step cần redirect tới
        const stepIndex = steps.findIndex(
          (step) => step.slug === validation.redirect
        );

        if (stepIndex !== -1) {
          // Thêm check để đảm bảo tìm thấy step
          return {
            isValid: false,
            message: validation.message,
            redirect: validation.redirect,
            stepIndex: stepIndex,
          };
        }
      }
    }

    return { isValid: true };
  };

  useEffect(() => {
    const validation = validateCampaign();
    if (!validation.isValid) {
      setStep(validation.stepIndex); // Set current step trước
      navigate(validation.redirect, {
        state: { error: validation.message },
        replace: true, // Thêm replace để không thể back lại
      });
    }
  }, [newCampaign, navigate, setStep, steps]);

  if (!validateCampaign().isValid) {
    return null;
  }

  return (
    <div className="container mx-auto space-y-6 md:p-20 p-0">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Hoàn thành chiến dịch!</h1>
          <p className="text-muted-foreground text-lg">
            Vui lòng nhấn hoàn thành để hoàng tất tạo chiến dịch. ãy chia sẻ
            chiến dịch với mọi người để bắt đầu nhận quyên góp.
          </p>
        </div>

        <div className="bg-muted/30 p-6 rounded-lg">
          <h3 className="font-semibold text-xl mb-4">{newCampaign.title}</h3>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to={`/fund/${newCampaign.id}`}>Xem chiến dịch</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/my-campaigns">Quản lý chiến dịch</Link>
            </Button>
          </div>
        </div>

        <div className="pt-8 space-y-4">
          <h4 className="font-semibold text-lg">Các bước tiếp theo</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg border bg-card">
              <h5 className="font-medium mb-2">Chia sẻ</h5>
              <p className="text-sm text-muted-foreground">
                Chia sẻ chiến dịch của bạn trên mạng xã hội
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h5 className="font-medium mb-2">Cập nhật</h5>
              <p className="text-sm text-muted-foreground">
                Thường xuyên cập nhật tiến độ cho người ủng hộ
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h5 className="font-medium mb-2">Kết nối</h5>
              <p className="text-sm text-muted-foreground">
                Tương tác với cộng đồng người ủng hộ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finish;
