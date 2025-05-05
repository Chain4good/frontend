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
  ],
  currentStep: 0,
  setStep: (step) => set({ step }),
  nextStep: () =>
    set((state) => ({
      currentStep:
        state.currentStep === get().steps.length - 1
          ? get().steps.length - 1
          : state.currentStep + 1,
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: state.currentStep === 0 ? 0 : state.currentStep - 1,
    })),
}));

export default useCreateStep;
