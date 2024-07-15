import { create } from "zustand";

interface textEditorState {
  text: string;
  isGenerating: boolean;
  aiText: any;
  setText: (value: string) => void;
  setIsGenerating: (value: boolean) => void;
  setAiText: (value: any) => void;
}

const useTextPod = create<textEditorState>((set) => ({
  text: "",
  isGenerating: false,
  aiText: null,

  setText: (value) => set({ text: value }),
  setAiText: (value) => set({ aiText: value }),
  setIsGenerating: (value) => set({ isGenerating: value }),
}));

export default useTextPod;
