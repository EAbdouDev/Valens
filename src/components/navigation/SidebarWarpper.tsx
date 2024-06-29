"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import useSidebar from "@/zuztand/sidebar";
import Sidebar from "./Sidebar";

interface SidebarWarpperProps {
  userRole: string;
}

const SidebarWarpper: FC<SidebarWarpperProps> = ({ userRole }) => {
  const { isPinned, isExpanded } = useSidebar();

  return (
    <motion.div
      className=" h-full  "
      animate={{
        width: isExpanded || isPinned ? "256px" : "80px",
      }}
      transition={{ duration: 0.3 }}
    >
      <Sidebar userRole={userRole} />
    </motion.div>
  );
};

export default SidebarWarpper;
