"use client";
import { FC, useEffect, useState } from "react";
import { format } from "date-fns";
import UserMenu from "./UserMenu";
import ThemeSwitcher from "./ThemeSwitcher";
import Main from "../copilot/Main";
import HeaderTitle from "./HeaderTitle";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const [logoVar, setLogoVar] = useState("/logo/logo_dark_mode-01.svg");

  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (isDark) {
      setLogoVar("/logo/logo_dark_mode-01.svg");
    } else {
      setLogoVar("/logo/logo_icon_dark_mode-01.svg");
    }
  }, [isDark]);

  return (
    <div className="w-full flex justify-between items-center ">
      <div className="flex justify-start items-center gap-3 ">
        <Image src={logoVar} alt="logo_dark_icon" width={35} height={35} />

        <h1 className="text-xl font-bold">Valens</h1>
      </div>
      <div className="w-[30%]">
        <Input
          placeholder="Search..."
          className="w-full "
          variant="bordered"
          startContent={<Search className="w-5 h-5 opacity-70" />}
        />
      </div>
      <div className="flex justify-center items-center gap-6">
        <Main />
        <ThemeSwitcher />
        <UserMenu />
        {/* <span className="text-lg">{currentTime}</span> */}
      </div>
    </div>
  );
};

export default Navbar;
