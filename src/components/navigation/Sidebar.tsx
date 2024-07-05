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
import Image from "next/image";
import { FC } from "react";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useSidebar from "@/zuztand/sidebar";

interface SidebarProps {
  userRole: string;
}

const Sidebar: FC<SidebarProps> = ({ userRole }) => {
  const pathname = usePathname();
  const { isExpanded, setIsExpanded, isPinned, setIsPinned } = useSidebar();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    setIsPinned(!isPinned);
  };

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
      href: "/v/transcriptions",
      active: pathname.includes("transcriptions"),
      icon: <BookAudio className="w-5 h-5" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className={`h-full flex flex-col  w-[256px] `}
      // initial={false}
      // animate={{
      //   width: isExpanded || isPinned ? "256px" : "80px",
      // }}
      // transition={{ duration: 0.3 }}
      // onMouseEnter={() => {
      //   if (!isPinned) setIsExpanded(true);
      // }}
      // onMouseLeave={() => {
      //   if (!isPinned) setIsExpanded(false);
      // }}
    >
      <div className="flex justify-between items-center w-full px-4 py-6 ">
        <div className="flex flex-col justify-start items-start gap-2">
          <div className="flex justify-start items-center gap-3 px-2">
            <Image
              src={"/logo/logo_icon_dark_mode-01.svg"}
              alt="logo_dark_icon"
              width={35}
              height={35}
            />

            <h1 className="text-xl font-bold">Valens</h1>
          </div>
        </div>
        {/* {(isExpanded || isPinned) && (
          <button
            onClick={handleToggle}
            className="p-2 rounded-lg opacity-60 hover:bg-slate-100 hover:opacity-100 transition-all ease-in-out"
          >
            {!isExpanded && isPinned ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelRightClose className="w-5 h-5" />
            )}
          </button>
        )} */}
      </div>

      <motion.div
        className="flex-grow my-4 px-2 py-4 w-full"
        // variants={containerVariants}
        // initial="hidden"
        // animate={isExpanded || isPinned ? "visible" : "hidden"}
      >
        <ul className="flex flex-col justify-start items-start gap-4 w-full">
          {links?.map((link) => (
            <li key={link.name} className="w-full">
              <Link
                href={link.href}
                className={`flex items-center gap-3 py-2 px-4 rounded-lg w-full font-medium transition-all ease-in-out ${
                  link.active
                    ? `bg-white text-violet-600 font-semibold`
                    : `hover:bg-gray-200`
                }`}
              >
                {link.icon}

                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
      <div className="  space-y-4">
        <div className="p-2">
          <Link
            href={"/v/guides"}
            className={`flex items-center gap-3 py-2 px-4 rounded-lg w-full font-medium transition-all ease-in-out ${
              pathname.includes("guides")
                ? `bg-white text-violet-600 font-semibold`
                : `hover:bg-gray-200`
            }`}
          >
            <Book className="w-5 h-5" />
            Guides
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
