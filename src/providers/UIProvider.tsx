"use client";
import { FC, ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";

interface UIProviderProps {
  children: ReactNode;
}

const UIProvider: FC<UIProviderProps> = ({ children }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};

export default UIProvider;
