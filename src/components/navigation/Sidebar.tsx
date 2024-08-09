"use client";
import {
  BookAudio,
  Files,
  FileText,
  Hospital,
  House,
  Network,
  TrafficCone,
  Zap,
} from "lucide-react";
import { FC, useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import ThemeSwitcher from "./ThemeSwitcher";

interface SidebarProps {}

const MainSidebar: FC<SidebarProps> = ({}) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [logoVar, setLogoVar] = useState("/logo/LightV.png");

  useEffect(() => {
    if (isDark) {
      setLogoVar("/logo/DarkV.png");
    } else {
      setLogoVar("/logo/LightV.png");
    }
  }, [isDark]);

  const links = [
    {
      name: "Notes",
      href: "/v/notes",
      active: pathname.includes("notes"),
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Flashcards",
      href: "/v/flashcards",
      active: pathname.includes("flashcards"),
      icon: <Zap className="w-5 h-5" />,
    },
    {
      name: "Cases",
      href: "/v/cases",
      active: pathname.includes("/cases"),
      icon: <Hospital className="w-5 h-5" />,
    },

    {
      name: "Podcasts",
      href: "/v/podcasts",
      active: pathname.includes("podcasts"),
      icon: <BookAudio className="w-5 h-5" />,
    },
  ];

  return (
    <motion.div
      className={`h-full flex flex-col w-full justify-center items-center `}
    >
      <div className="flex justify-center items-center mb-2 pb-2 pt-4 !px-0 w-full">
        <Tooltip content="Valens" placement="right-start" color="primary">
          <Link href={"/v/notes"}>
            <Image src={logoVar} alt="logo_dark_icon" width={35} height={35} />
          </Link>
        </Tooltip>
      </div>
      <motion.div className="flex-grow px-2 py-4 w-full">
        <ul className="flex flex-col justify-start items-start gap-3 w-full">
          {links?.map((link) => (
            <li key={link.name} className="w-full">
              <Tooltip
                content={link.name}
                placement="right-start"
                color="primary"
              >
                <Link
                  prefetch={false}
                  href={link.href}
                  className={`flex items-center gap-3 py-2 px-4 rounded-lg w-full font-medium transition-all ease-in-out ${
                    link.active
                      ? `bg-black text-white dark:bg-white dark:text-black opacity-100 font-semibold`
                      : `hover:bg-gray-300 dark:hover:bg-[#565656] opacity-80`
                  }`}
                >
                  {link.icon}
                </Link>
              </Tooltip>
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="mt-auto py-4 flex flex-col gap-6">
        <ThemeSwitcher />
        <UserMenu />
      </div>
    </motion.div>
  );
};

export default MainSidebar;
