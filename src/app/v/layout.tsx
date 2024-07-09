import Sidebar from "@/components/navigation/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import { auth } from "../../../firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import SidebarWarpper from "@/components/navigation/SidebarWarpper";
import Navbar from "@/components/navigation/Navbar";
import Main from "@/components/copilot/Main";
import { AI } from "@/components/copilot/actions";

interface LayoutProps {
  children: ReactNode;
}

const layout: FC<LayoutProps> = async ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col h-screen">
      <div className="flex-1 flex flex-row overflow-y-hidden overflow-x-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden bg-white dark:bg-[#0c0c0c] mt-4  rounded-t-2xl ">
          <AI>
            <nav className="px-8 py-4  min-h-[70px] max-h-[70px]">
              <Navbar />
            </nav>
          </AI>
          <main className="px-10 py-8 flex-1 ">{children}</main>

          {/* <footer className="p-4 border-t">Footer</footer> */}
        </div>

        <aside className="order-first  overflow-y-auto   ">
          <Sidebar userRole="teacher" />
        </aside>
      </div>
    </div>
  );
};

export default layout;
