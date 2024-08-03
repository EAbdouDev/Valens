import { AppStateProvider } from "@/lib/utils/app-state";
import { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="w-full h-full  ">
      <AppStateProvider>{children}</AppStateProvider>
    </div>
  );
};

export default layout;
