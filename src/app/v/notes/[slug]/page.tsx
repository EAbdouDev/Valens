import TextEditor from "@/components/editor/TextEditor";
import { FC } from "react";

import Toolbar from "@/components/editor/Toolbar";
import { AI } from "@/app/actions";
import { Chat } from "@/components/note-assist/chat";
import { generateId } from "ai";
import BlockTextEditor from "@/components/editor/BlockTextEditor";

export const maxDuration = 60;

interface pageProps {
  params: {
    slug: string;
  };
}

const NewNotePage: FC<pageProps> = ({ params }) => {
  const id = generateId();

  return (
    <div className="min-h-full flex flex-col h-full">
      <header className="border-b p-4"> Header</header>
      {/* <!-- main container --> */}
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <main className="flex-1  overflow-y-auto mt-6">
          <BlockTextEditor />
        </main>

        {/* <nav class="order-first sm:w-32 bg-purple-200 overflow-y-auto">Sidebar</nav> */}

        <aside className={`sm:w-[35%] overflow-y-auto border-l p-4  `}>
          <h1 className="text-2xl font-bold mb-10 p-2">Assistant</h1>
          <AI initialAIState={{ chatId: id, messages: [] }}>
            <Chat id={"sdds"} query={""} />
          </AI>
        </aside>
      </div>
      {/* <!-- end main container --> */}

      {/* <footer class="bg-gray-100">Footer</footer> */}
    </div>
  );
};

export default NewNotePage;
