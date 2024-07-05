import Sidebar from "@/components/navigation/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import { auth } from "../../../firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import SidebarWarpper from "@/components/navigation/SidebarWarpper";
import Navbar from "@/components/navigation/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const layout: FC<LayoutProps> = async ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col h-screen">
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto bg-white mt-4  rounded-tl-2xl border">
          <nav className="px-8 py-4 border-b min-h-[70px] max-h-[70px]">
            <Navbar />
          </nav>
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
