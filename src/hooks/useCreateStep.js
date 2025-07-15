import { create } from "zustand";

const useCreateStep = create((set, get) => ({
  steps: [
    {
      title: "Danh mục",
      description: "Chọn danh mục gây quỹ phù hợp với chiến dịch của bạn",
      slug: "/create/fundraiser/category",
    },
    {
      title: "Mục tiêu",
      description: "Thiết lập mục tiêu gây quỹ và thời hạn chiến dịch",
      slug: "/create/fundraiser/goal",
    },
    {
      title: "Hình thức",
      description: "Lựa chọn hình thức gây quỹ (cá nhân, tổ chức, dự án...)",
      slug: "/create/fundraiser/types",
    },
    {
      title: "Nội dung",
      description:
        "Mô tả chi tiết về chiến dịch, mục đích và kế hoạch sử dụng quỹ",
      slug: "/create/fundraiser/description",
    },
    {
      title: "Hình ảnh/Video",
      description: "Thêm hình ảnh, video để minh họa cho chiến dịch của bạn",
      slug: "/create/fundraiser/media",
    },
    {
      title: "Hoàn tất",
      description: "Xem lại và hoàn tất thiết lập chiến dịch gây quỹ",
      slug: "/create/fundraiser/finish",
    },
  ],
  currentStep: 0,

  // Đặt bước hiện tại
  setStep: (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < get().steps.length) {
      set({ currentStep: stepIndex });
    }
  },

  // Chuyển đến bước tiếp theo
  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  // Quay lại bước trước
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  // Kiểm tra có thể đi tiếp
  canGoNext: () => {
    const { currentStep, steps } = get();
    return currentStep < steps.length - 1;
  },

  // Kiểm tra có thể quay lại
  canGoPrev: () => {
    const { currentStep } = get();
    return currentStep > 0;
  },
}));

export default useCreateStep;
