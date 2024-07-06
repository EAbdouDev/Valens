"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { Skeleton } from "../ui/skeleton";

interface ThemeSwitcherProps {}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({}) => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  let isDark = theme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChangeTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!isMounted) {
    return <Skeleton className="w-6 h-6 rounded-full" />;
  }

  return (
    <div className="">
      <button
        onClick={handleChangeTheme}
        className="flex justify-center items-center p-1"
      >
        {isDark ? <Sun /> : <Moon />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
