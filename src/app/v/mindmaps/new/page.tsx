"use client";

import TextEditor from "@/components/editor/TextEditor";
// import ExcalidrawWrapper from "@/components/mindmaps/ExcalidrawWrapper";
import Header from "@/components/mindmaps/Header";
import { FC } from "react";
import dynamic from "next/dynamic";

interface pageProps {}

const NewMindMapPage: FC<pageProps> = ({}) => {
  return (
    <div className="min-h-full flex flex-col h-full">
      <header>
        <Header />
      </header>
      {/* <!-- main container --> */}
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <main className="flex-1  overflow-y-auto">
          {" "}
          <TextEditor content="" />{" "}
        </main>

        <aside className={`sm:w-[50%] overflow-y-auto  border-l `}>
          {/* <ExcalidrawWrapper /> */}
        </aside>
      </div>
      {/* <!-- end main container --> */}

      {/* <footer class="bg-gray-100">Footer</footer> */}
    </div>
  );
};

export default NewMindMapPage;
