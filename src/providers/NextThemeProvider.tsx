"use client";
import { FC, useEffect } from "react";
import { ThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const NextThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
};

export default NextThemeProvider;
