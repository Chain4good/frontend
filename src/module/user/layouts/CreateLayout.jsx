import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useCreateStep from "@/hooks/useCreateStep";
import Auth from "./Auth";
import useCampaign from "@/hooks/useCampaign";
import { toast } from "sonner";
import { createCampaign } from "@/services/campaignService";

const CreateLayout = () => {
  const navigate = useNavigate();
  const { steps, nextStep, prevStep, currentStep, canGoNext, canGoPrev } =
    useCreateStep();
  const { newCampaign } = useCampaign();

  const { mutate: createNewCampaign, isPending } = useMutation({
    mutationFn: createCampaign,
    onSuccess: (data) => {
      toast.success("Chiến dịch tạo thành công!");
      console.log(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleNextStep = () => {
    // Validate current step before moving to next
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const handlePrevStep = () => {
    prevStep();
  };

  const validateCurrentStep = () => {
    // Add validation logic here based on currentStep
    return true;
  };

  useEffect(() => {
    // Add protection against direct URL access
    const currentPath = window.location.pathname;
    const currentStepIndex = steps.findIndex(
      (step) => step.slug === currentPath
    );

    if (currentStepIndex !== -1 && currentStepIndex !== currentStep) {
      navigate(steps[currentStep].slug, { replace: true });
    }
  }, [currentStep, navigate, steps]);

  const handleFinish = () => {
    createNewCampaign(newCampaign);
  };

  return (
    <div className="bg-[#F4F2EC] grid grid-cols-3 w-screen h-screen">
      <Auth />
      <div className="col-span-1 p-10 flex flex-col h-screen">
        <Link to="/">
          <img src={"/logo.svg"} className="w-[40px] h-[40px]" />
        </Link>
        <div className="flex-1 flex items-center justify-center flex-col ">
          <div>
            <h2 className="text-left text-4xl mb-4 leading-9">
              {steps[currentStep].title}
            </h2>
            <p className="text-left">{steps[currentStep].description}</p>
          </div>
        </div>
      </div>
      <div className="col-span-2 flex rounded-l-[64px] bg-white h-full py-10 flex-col overflow-auto">
        <main className="flex-1 w-full flex items-center justify-center ">
          <Outlet />
        </main>
        <Separator />
        <div className="h-32 flex px-10 bottom-0 py-6 w-full justify-between items-center">
          {canGoPrev() && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevStep}
              className="text-md"
            >
              <ChevronLeft />
              Quay lại
            </Button>
          )}

          {canGoNext() ? (
            <Button onClick={handleNextStep} size="lg" className="text-md">
              Tiếp tục
              <ChevronRight />
            </Button>
          ) : (
            <Button
              size="lg"
              className="text-md"
              onClick={handleFinish}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="animate-spin mr-2">◯</span>
                  Đang xử lý...
                </>
              ) : (
                "Hoàn thành"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLayout;
