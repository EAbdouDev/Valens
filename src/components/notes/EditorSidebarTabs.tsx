"use client";

import useNote from "@/zuztand/notesState";
import { Tooltip } from "@nextui-org/react";
import { AudioLinesIcon, BookAudio, ScanSearch, Zap } from "lucide-react";
import { FC } from "react";
import Cookies from "js-cookie";
import { IconPdf } from "@tabler/icons-react";

interface NotesSidebarProps {}

const EditorSidebarTabs: FC<NotesSidebarProps> = ({}) => {
  const { sideBarTab, setSideBarTab, setSideBarTabMobile, sideBarTabMobile } =
    useNote();

  const tabs = [
    {
      name: "Search & Chat",
      icon: <ScanSearch className="w-6 h-6" />,
    },
    {
      name: "Create Flashcards",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      name: "Convert to podcast",
      icon: <AudioLinesIcon className="w-6 h-6 " />,
    },
    {
      name: "PDF Tools",
      icon: <IconPdf className="w-6 h-6" />,
    },
  ];

  return (
    <div className="flex flex-row lg:flex-col lg:gap-4 gap-4 p-2 mt-2 ">
      {tabs.map((tab, index) => (
        <Tooltip
          key={index}
          content={tab.name}
          placement="left-start"
          color="primary"
        >
          <button
            onClick={() => {
              setSideBarTab(index);

              setSideBarTabMobile({ index: index, isOpen: true });
            }}
            className={` ${
              index === sideBarTab
                ? "lg:bg-gray-200 dark:bg-secondary dark:text-secondary-foreground"
                : "lg:hover:bg-gray-200 dark:hover:bg-secondary dark:text-secondary-foreground"
            } p-2 rounded-md`}
          >
            {tab.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

export default EditorSidebarTabs;
