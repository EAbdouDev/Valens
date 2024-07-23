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

interface EditorAgentsTabsProps {}

const EditorAgentsTabs: FC<EditorAgentsTabsProps> = ({}) => {
  const { sideBarTab, sideBarTabMobile, setSideBarTabMobile } = useNote();

  return (
    <div className="">
      {sideBarTab === 0 && (
        <aside className="w-full h-full overflow-y-auto p-4 flex-1">
          <h1 className="text-2xl font-bold mb-10 p-2">Assistant</h1>

          <Chat id={"sdds"} query={""} />
        </aside>
      )}

      {sideBarTab === 1 && (
        <aside className="w-full h-full overflow-y-auto p-4 flex-1">
          <h1 className="text-2xl font-bold mb-10 p-2">Convert to podcast</h1>
          Con
        </aside>
      )}

      {sideBarTabMobile?.index === 0 && (
        <Drawer
          open
          onOpenChange={(open) => {
            if (!open) {
              setSideBarTabMobile(null);
            }
          }}
        >
          <DrawerContent className="h-full">
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
    </div>
  );
};

export default EditorAgentsTabs;
