import { Metadata } from "next";
import { FC, ReactNode } from "react";

export const metadata: Metadata = {
  title: "New Case",

  description: "An assistant to help medical studnets.",
};

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return <div className="container p-8 max-w-3xl mx-auto">{children}</div>;
};

export default layout;
