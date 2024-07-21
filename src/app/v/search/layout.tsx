import Header from "@/components/note-assist/header";
import { AppStateProvider } from "@/lib/utils/app-state";
import { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div>
      <AppStateProvider>
        <Header />
        {children}
      </AppStateProvider>
    </div>
  );
};

export default layout;