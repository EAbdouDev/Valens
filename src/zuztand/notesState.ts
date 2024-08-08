import { create } from "zustand";

interface NoteState {
  text: any;
  editorObj: any;
  isTidy: boolean;
  setIsTidy: (value: boolean) => void;
  tidyText: string;
  setTidyText: (value: any) => void;
  setEditorObj: (value: any) => void;
  sideBarTab: number;
  sideBarTabMobile: { index: number; isOpen: boolean } | null;
  setSideBarTabMobile: (
    value: { index: number; isOpen: boolean } | null
  ) => void;
  setSideBarTab: (value: number) => void;
  setText: (value: any) => void;
}

const useNote = create<NoteState>((set) => ({
  text: "",
  tidyText: "",
  sideBarTab: 0,
  editorObj: {},
  isTidy: false,
  sideBarTabMobile: null,
  setSideBarTabMobile: (value) => set({ sideBarTabMobile: value }),
  setEditorObj: (value) => set({ editorObj: value }),
  setSideBarTab: (value) => set({ sideBarTab: value }),
  setText: (value) => set({ text: value }),
  setTidyText: (value) => set({ tidyText: value }),
  setIsTidy: (value) => set({ isTidy: value }),
}));

export default useNote;
