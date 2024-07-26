import { create } from "zustand";

interface NoteState {
  text: any;
  editorObj: any;
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
  sideBarTab: 0,
  editorObj: {},
  sideBarTabMobile: null,
  setSideBarTabMobile: (value) => set({ sideBarTabMobile: value }),
  setEditorObj: (value) => set({ editorObj: value }),
  setSideBarTab: (value) => set({ sideBarTab: value }),
  setText: (value) => set({ text: value }),
}));

export default useNote;
