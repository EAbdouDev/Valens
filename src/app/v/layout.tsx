import Sidebar from "@/components/navigation/Sidebar";
import { FC, ReactNode } from "react";
import Navbar from "@/components/navigation/Navbar";
import { AI } from "@/components/copilot/actions";

interface LayoutProps {
  children: ReactNode;
}

const layout: FC<LayoutProps> = async ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col h-screen">
      <div className="flex-1 flex flex-row overflow-y-hidden overflow-x-hidden">
        <div className="flex-1 flex flex-col overflow-y-hidden overflow-x-hidden bg-white dark:bg-[#0c0c0c] ">
          <AI>
            <nav className="px-8 py-4  min-h-[70px] max-h-[70px] border-b bg-transparent backdrop-blur">
              <Navbar />
            </nav>
          </AI>
          <main className="px-8 py-8 flex-1 overflow-auto">{children}</main>

          {/* <footer className="p-4 border-t">Footer</footer> */}
        </div>

        <aside className="order-first  overflow-y-auto border-r   ">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
};

export default layout;
