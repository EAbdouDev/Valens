"use client";
import { FC, Suspense, useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const NextThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  console.log(theme);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <NextTopLoader
        color={theme === "dark" ? "#ffff" : "#000"}
        initialPosition={0.08}
        crawlSpeed={200}
        showSpinner={false}
        height={3}
        crawl={true}
        easing="ease-in-out"
        speed={200}
        shadow="0 0 10px #ffff,0 0 5px #ffffD"
        zIndex={1600}
      />
      {children}
    </ThemeProvider>
  );
};

export default NextThemeProvider;
