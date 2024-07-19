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
      <header className="">
        <AI>
          <nav className="p-4 lg:px-6 lg:py-3  max-h-fit border-b bg-transparent backdrop-blur">
            <Navbar />
          </nav>
        </AI>
      </header>
      {/* <!-- main container --> */}
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <main className="flex-1  overflow-y-auto ">{children}</main>

        <nav className="order-first hidden sm:flex sm:w-[250px]  overflow-y-auto border-r  ">
          <Sidebar />
        </nav>

        {/* <aside className="sm:w-32  overflow-y-auto">Right Sidebar</aside> */}
      </div>
      {/* <!-- end main container --> */}

      {/* <footer className="bg-gray-100">Footer</footer> */}
    </div>
  );
};

export default layout;
