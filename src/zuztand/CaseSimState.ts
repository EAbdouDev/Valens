import { create } from "zustand";

interface NewAIModalState {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  textInput: string;
  setTextInput: (value: string) => void;
}

const useCaseSim = create<NewAIModalState>((set) => ({
  isListening: false,
  setIsListening: (value) => set({ isListening: value }),
  textInput: "",
  setTextInput: (value) => set({ textInput: value }),
}));

export default useCaseSim;
