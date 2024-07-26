"use client";
import { FC, Suspense, useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const NextThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default NextThemeProvider;
