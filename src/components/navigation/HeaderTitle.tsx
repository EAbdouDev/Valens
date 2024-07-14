"use client";

import { usePathname } from "next/navigation";
import { FC } from "react";

interface HeaderTitleProps {}

const HeaderTitle: FC<HeaderTitleProps> = ({}) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      "/v/dashboard": "Dashboard",
      "/v/notes": "Notes",

      "/v/cases": "Cases",
      "/v/podcasts": "Podcasts",
      "/v/podcasts/new": "New Podcast",
      // Add more path-to-title mappings as needed
    };

    return titles[pathname] || "Valnes AI";
  };

  return <div>{getPageTitle()}</div>;
};

export default HeaderTitle;
