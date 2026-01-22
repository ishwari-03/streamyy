import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamyy-theme") || "light",
  setTheme: (theme) => {
    localStorage.setItem("streamyy-theme", theme);
    set({ theme });
  },
}));