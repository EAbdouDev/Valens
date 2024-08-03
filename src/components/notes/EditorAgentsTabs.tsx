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

      {sideBarTab === 3 && (
        <aside className="w-full h-full overflow-y-auto p-4 flex-1">
          <h1 className="text-2xl font-bold mb-10 p-2">PDF to notes </h1>

          <PdfSum />
        </aside>
      )}

      {sideBarTab === 4 && (
        <aside className="w-full h-full overflow-y-auto p-4 flex-1">
          <h1 className="text-2xl font-bold mb-6 p-2">Slides </h1>
          <Slides />
          {/* <PdfChat /> */}
        </aside>
      )}

      {/* <div className="flex lg:hidden">
        {sideBarTabMobile?.index === 0 && (
          <Drawer
            open
            onOpenChange={(open) => {
              if (!open) {
                setSideBarTabMobile(null);
              }
            }}
          >
            <DrawerContent className="h-full ">
              <DrawerHeader className="flex flex-col justify-start w-full text-left">
                <DrawerTitle>Assistant</DrawerTitle>
              </DrawerHeader>
              <div className="overflow-y-auto overflow-x-hidden px-4">
                {" "}
                <Chat id={"no-id-for-now"} query={""} />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div> */}
    </div>
  );
};

export default EditorAgentsTabs;
