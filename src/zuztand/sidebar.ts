import { create } from "zustand";

interface sidebarState {
  isPinned: boolean;
  setIsPinned: (value: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const useSidebar = create<sidebarState>((set) => ({
  isPinned: true,
  setIsPinned: (value) => set({ isPinned: value }),
  isExpanded: false,
  setIsExpanded: (value) => set({ isExpanded: value }),
}));

export default useSidebar;
