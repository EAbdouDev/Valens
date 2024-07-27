import { FormProvider } from "@/components/cases/FormProvider";
import { Metadata } from "next";
import { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "New Custom Case",

  description: "An assistant to help medical studnets.",
};

const layout: FC<layoutProps> = ({ children }) => {
  return <FormProvider>{children}</FormProvider>;
};

export default layout;
