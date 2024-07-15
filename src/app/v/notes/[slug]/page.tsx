import TextEditor from "@/components/editor/TextEditor";
import { FC } from "react";

import Toolbar from "@/components/editor/Toolbar";
import { AI } from "@/app/actions";
import { Chat } from "@/components/note-assist/chat";
import { generateId } from "ai";

export const maxDuration = 300;

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = ({ params }) => {
  const id = generateId();

  return (
    <div className=" w-full h-full  rounded-lg ">
      {/* Main */}
      <div className="flex justify-start items-start gap-2 w-full h-full">
        <div className="flex-1 h-full   overflow-auto pr-4">
          <TextEditor />
        </div>
        <div className="min-w-[40%] max-w-[40%]  h-full rounded-2xl p-4 overflow-auto border">
          <AI initialAIState={{ chatId: id, messages: [] }}>
            <Chat id={"sdds"} query={""} />
          </AI>
        </div>
      </div>
    </div>
  );
};

export default page;
