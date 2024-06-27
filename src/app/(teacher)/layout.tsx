import { ArrowLeftDoubleIcon } from "@hugeicons/react-pro";
import Image from "next/image";
import { FC, ReactNode } from "react";
import { PanelLeftClose } from "lucide-react";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col h-screen">
      {/* <!-- main container --> */}
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <div className="flex-1 flex flex-col  overflow-y-auto ">
          <header className="border-b px-4 py-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </header>

          <main className="px-4 py-6 flex-1">{children}</main>
          <footer className="p-4 border-t">Footer</footer>
        </div>

        <nav className="order-first sm:w-64 overflow-y-auto border-r px-4 py-6">
          <div className="flex justify-between items-center w-full">
            <div className=" flex justify-start items-center gap-2 ">
              <Image
                src={"/logo/logo_icon_dark_mode-01.svg"}
                alt="logo_dark_icon"
                width={30}
                height={30}
              />
              <h1 className="text-2xl font-bold">Valnes AI</h1>
            </div>
            <PanelLeftClose className="opacity-60 cursor-pointer hover:opacity-100 transition-all ease-in-out" />
          </div>
        </nav>
      </div>
      {/* <!-- end main container --> */}
    </div>
  );
};

export default layout;
