"use client";
import { PanelLeftClose } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import UserMenu from "./UserMenu";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center w-full px-4 py-6">
        <div className="flex justify-start items-center gap-2">
          <Image
            src={"/logo/logo_icon_dark_mode-01.svg"}
            alt="logo_dark_icon"
            width={30}
            height={30}
          />
          <h1 className="text-xl font-bold">Valnes AI</h1>
        </div>
        <PanelLeftClose className="opacity-60 cursor-pointer hover:opacity-100 transition-all ease-in-out w-5 h-5" />
      </div>

      <div className="flex-grow"></div>
      <div className=" border-t p-2">
        <UserMenu />
      </div>
    </div>
  );
};

export default Sidebar;
