"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface MindTabsProps {}

const MindmapsTabs: FC<MindTabsProps> = ({}) => {
  const pathname = usePathname();

  return (
    <div className="Tabs flex justify-start items-center gap-6 font-light transition-all ease-soft-spring">
      <Link
        href="/v/cases"
        className={`transition-all ease-soft-spring ${
          pathname === "/v/mindmaps"
            ? "border-b-2 border-black opacity-100"
            : "opacity-70"
        }`}
      >
        My MindMaps
      </Link>
      <Link
        href="/v/mindmaps/browse"
        className={`transition-all ease-soft-spring ${
          pathname === "/v/mindmaps/browse"
            ? "border-b-2 border-black opacity-100"
            : "opacity-70"
        }`}
      >
        Browse MindMaps
      </Link>
    </div>
  );
};

export default MindmapsTabs;
