import MainSidebar from "@/components/navigation/Sidebar";
import { FC, ReactNode } from "react";
import Navbar from "@/components/navigation/Navbar";
import { AI } from "@/components/copilot/actions";
import Link from "next/link";
import Main from "@/components/copilot/Main";

interface LayoutProps {
  children: ReactNode;
}

const layout: FC<LayoutProps> = async ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col h-screen">
      {/* <!-- main container --> */}
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <main className="flex-1  overflow-y-auto flex flex-col  ">
          <header className="">
            <AI>
              <nav className="p-4 lg:px-6 lg:py-3  max-h-fit border-b bg-transparent backdrop-blur">
                <Navbar />
              </nav>
            </AI>
          </header>
          {children}
        </main>

        <nav className="order-first hidden sm:flex sm:w-fit  overflow-y-auto border-r  ">
          <MainSidebar />
        </nav>
      </div>
      {/* <!-- end main container --> */}

      <footer className="border-t py-2 xl:flex justify-between items-center gap-4 hidden px-4">
        <div className="flex justify-center items-center gap-2">
          <h3 className="text-xs font-light">Powerd by Google Gemini AI</h3>
        </div>
        <div className="flex justify-center items-center">
          <Link
            href={"https://github.com/EAbdouDev/Valens"}
            target="_blank"
            className="flex justify-center items-center gap-2 hover:underline border-r-2 pr-6"
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-brand-github"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#2c3e50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
            </svg>
            <h3 className="text-xs font-light">Developed by eslam abdou</h3>
          </Link>
          <div className="flex justify-center items-center gap-4">
            <p className="text-xs opacity-80 pl-6">V0.01</p>
            <Link
              href={"/privacy-policy"}
              className="text-xs opacity-80 hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default layout;
