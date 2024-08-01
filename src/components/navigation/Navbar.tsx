"use client";
import { FC, useEffect, useState } from "react";
import { format } from "date-fns";
import UserMenu from "./UserMenu";
import ThemeSwitcher from "./ThemeSwitcher";
import HeaderTitle from "./HeaderTitle";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  return (
    <div className="w-full flex justify-between items-center ">
      <div className="w-[20%]">
        <Input
          placeholder="Search..."
          className="w-full "
          variant="flat"
          startContent={<Search className="w-5 h-5 opacity-70" />}
        />
      </div>
      <div className="flex justify-center items-center gap-6">
        <ThemeSwitcher />
        <UserMenu />
      </div>
    </div>
  );
};

export default Navbar;
