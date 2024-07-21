"use client";
import {
  Book,
  BookAudio,
  BookOpenCheck,
  Disc2,
  Files,
  Hospital,
  House,
  Network,
  PanelLeftClose,
  PanelRightClose,
  Users,
  Zap,
} from "lucide-react";
import { FC, useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useSidebar from "@/zuztand/sidebar";
import { useTheme } from "next-themes";
import { Tooltip } from "@nextui-org/react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SidebarProps {}

const MainSidebar: FC<SidebarProps> = ({}) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);

  const links = [
    {
      name: "Dashboard",
      href: "/v/dashboard",
      active: pathname.includes("dashboard"),
      icon: <House className="w-5 h-5" />,
    },
    {
      name: "Notes",
      href: "/v/notes",
      active: pathname.includes("notes"),
      icon: <Files className="w-5 h-5" />,
    },
    {
      name: "Flashcards",
      href: "/v/flashcards",
      active: pathname.includes("flashcards"),
      icon: <Zap className="w-5 h-5" />,
    },
    {
      name: "Questions",
      href: "/v/questions",
      active: pathname.includes("questions"),
      icon: <BookOpenCheck className="w-5 h-5" />,
    },
    {
      name: "Cases",
      href: "/v/cases",
      active: pathname.includes("cases"),
      icon: <Hospital className="w-5 h-5" />,
    },
    {
      name: "MindMaps",
      href: "/v/mindmaps",
      active: pathname.includes("mindmaps"),
      icon: <Network className="w-5 h-5" />,
    },
    {
      name: "Podcasts",
      href: "/v/podcasts",
      active: pathname.includes("podcasts"),
      icon: <BookAudio className="w-5 h-5" />,
    },
  ];

  const noisyGradientStyle = {
    backgroundImage: `
      linear-gradient(135deg, #6B73FF 0%, #000DFF 100%),
      url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgcBAQBWQ1tLAAAAAElFTkSuQmCC")
    `,
    backgroundBlendMode: "overlay",
    backgroundSize: "cover",
  };

  return (
    <motion.div
      className={`h-full flex flex-col  w-full justify-center items-center `}
    >
      <motion.div className="flex-grow my-4 px-2 py-2 w-full">
        <ul className="flex flex-col justify-start items-start gap-3 w-full">
          {links?.map((link) => (
            <li key={link.name} className="w-full">
              <Tooltip
                content={link.name}
                placement="right-start"
                color="primary"
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 py-2 px-4 rounded-lg w-full font-medium transition-all ease-in-out  ${
                    link.active
                      ? ` text-white font-semibold bg-black dark:bg-white dark:text-black opacity-100 `
                      : `hover:bg-gray-100 dark:hover:bg-[#1c1c1c] opacity-85`
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              </Tooltip>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default MainSidebar;
