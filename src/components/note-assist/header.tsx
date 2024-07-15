import React from "react";
import { cn } from "@/lib/utils";
import HistoryContainer from "./history-container";

export const Header: React.FC = async () => {
  return (
    <header className="fixed w-full p-1 md:p-2 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-background/80 md:bg-transparent">
      <div>
        <a href="/">
          <span className="sr-only">Morphic</span>
        </a>
      </div>
      <div className="flex gap-0.5">
        <HistoryContainer location="header" />
      </div>
    </header>
  );
};

export default Header;
