import { create } from "zustand";

interface NoteState {
  text: any;

  setText: (value: any) => void;
}

const useNote = create<NoteState>((set) => ({
  text: "",

  setText: (value) => set({ text: value }),
}));

export default useNote;
