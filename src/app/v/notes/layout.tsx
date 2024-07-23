import Header from "@/components/note-assist/header";
import { AppStateProvider } from "@/lib/utils/app-state";
import { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="w-full h-full ">
      <AppStateProvider>{children}</AppStateProvider>
    </div>
  );
};

export default layout;
