import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  userData: null,
  setUserData: (userData) =>
    set({
      userData: userData,
    }),

  setUser: (userData) =>
    set({
      user: userData,
      isAuthenticated: true,
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
    }),

  updateUser: (userData) =>
    set((state) => ({
      user: {
        ...state.user,
        ...userData,
      },
    })),
}));

export default useUserStore;
