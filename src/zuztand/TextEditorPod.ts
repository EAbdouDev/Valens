import { create } from "zustand";

interface textEditorState {
  text: string;
  setText: (value: string) => void;
}

const useTextPod = create<textEditorState>((set) => ({
  text: "",
  setText: (value) => set({ text: value }),
}));

export default useTextPod;
