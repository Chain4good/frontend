import { create } from "zustand";

const useCampaign = create((set, get) => ({
  newCampaign: {
    title: "",
    description: "",
    goal: null,
    deadline: null,
    isClosed: false,
    isNoLimit: false,
    status: "PENDING",
    categoryId: null,
    countryId: null,
    fundraiseTypeId: null,
    coverId: null,
    images: [],
  },
  setNewCampaign: (data) => {
    set({ newCampaign: data });
  },

  changeCampaignValue: (key, value) => {
    set({
      newCampaign: {
        ...get().newCampaign,
        [key]: value,
      },
    });
  },

  resetNewCampaign: () => {
    set({
      newCampaign: {
        title: "",
        description: "",
        goal: null,
        deadline: null,
        totalDonated: null,
        isClosed: false,
        isNoLimit: false,
        status: "PENDING",
        userId: null,
        categoryId: null,
        countryId: null,
        fundraiseTypeId: null,
        coverId: null,
        images: [],
      },
    });
  },

  addImage: (image) => {
    set({
      newCampaign: {
        ...get().newCampaign,
        images: [...get().newCampaign.images, image],
      },
    });
  },

  removeImage: (index) => {
    set({
      newCampaign: {
        ...get().newCampaign,
        images: get().newCampaign.images.filter((_, i) => i !== index),
      },
    });
  },

  clearImages: () => {
    set({
      newCampaign: {
        ...get().newCampaign,
        images: [],
      },
    });
  },
}));

export default useCampaign;
