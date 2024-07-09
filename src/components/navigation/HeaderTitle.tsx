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
      "/contact": "Contact",
      "/services": "Our Services",
      // Add more path-to-title mappings as needed
    };

    return titles[pathname] || "Valnes AI";
  };

  return <div>{getPageTitle()}</div>;
};

export default HeaderTitle;
