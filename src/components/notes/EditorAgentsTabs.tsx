"use client";

import useNote from "@/zuztand/notesState";
import { FC } from "react";
import { Chat } from "../note-assist/chat";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import CreateFlashcards from "./agents/CreateFlashcards";
import PdfSum from "./agents/pdfSum";
import Slides from "./agents/slides/Slide";
import AudioNotes from "./agents/AudioNotes";
import Mindmaps from "./agents/Mindmaps";

interface EditorAgentsTabsProps {
  noteSlug: string;
}

const EditorAgentsTabs: FC<EditorAgentsTabsProps> = ({ noteSlug }) => {
  const { sideBarTab, sideBarTabMobile, setSideBarTabMobile } = useNote();

  return (
    <div className=" h-full   ">
      {sideBarTab === 0 && (
        <aside className="w-full h-full overflow-y-auto p-2 flex-1">
          <h1 className="text-2xl font-bold mb-10  p-4  ">Search & Chat</h1>

          <Chat id={"sdds"} query={""} />
        </aside>
      )}

      {sideBarTab === 1 && (
        <aside className="w-full h-full overflow-y-auto p-2 flex-1">
          <h1 className="text-2xl font-bold mb-10 p-4 ">Flashcards</h1>
          <CreateFlashcards noteSlug={noteSlug} />
        </aside>
      )}

      {sideBarTab === 2 && (
        <aside className="w-full h-full overflow-y-auto p-4 flex-1">
          <h1 className="text-2xl font-bold mb-10 p-2">Note to podcast</h1>
          <AudioNotes noteSlug={noteSlug} />
        </aside>
      )}

      {sideBarTab === 3 && (
        <aside className="w-full h-full overflow-y-auto p-4 flex-1">
          <h1 className="text-2xl font-bold mb-10 p-2">PDF to notes </h1>

          <PdfSum />
        </aside>
      )}
    </div>
  );
};

export default EditorAgentsTabs;
