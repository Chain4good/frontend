import { create } from "zustand";

const useCreateStep = create((set, get) => ({
  steps: [
    {
      title: "Fundraise",
      description: "Start fundraising, tips, and resources",
      slug: "/create/fundraiser/category",
    },
    {
      title: "Goal",
      description: "Set your fundraising goal",
      slug: "/create/fundraiser/goal",
    },
    {
      title: "Type",
      description: "Select your fundraising type",
      slug: "/create/fundraiser/types",
    },
    {
      title: "Description",
      description: "Start fundraising, tips, and resources",
      slug: "/create/fundraiser/description",
    },
    {
      title: "Media",
      description: "Start fundraising, tips, and resources",
      slug: "/create/fundraiser/media",
    },
    {
      title: "Finish",
      description: "Start fundraising, tips, and resources",
      slug: "/create/fundraiser/finish",
    },
  ],
  currentStep: 0,

  setStep: (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < get().steps.length) {
      set({ currentStep: stepIndex });
    }
  },

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  canGoNext: () => {
    const { currentStep, steps } = get();
    return currentStep < steps.length - 1;
  },

  canGoPrev: () => {
    const { currentStep } = get();
    return currentStep > 0;
  },
}));

export default useCreateStep;
