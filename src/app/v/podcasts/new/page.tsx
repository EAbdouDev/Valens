import TextEditor from "@/components/editor/TextEditor";
import { FC } from "react";

interface pageProps {}

const NewPodPage: FC<pageProps> = ({}) => {
  return (
    <div className="space-y-4 w-full h-full ">
      <header className="h-[60px] bg-gray-100 w-full rounded-xl py-2 px-4 flex justify-between items-center ">
        <p>Untitled podcast-#2214</p>
      </header>
      <div className="flex justify-start items-start gap-6 w-full h-full">
        <div className="flex-1  h-full rounded-xl ">
          <TextEditor />
        </div>
        <div className="flex-1 bg-gray-50 h-full rounded-xl p-4">
          Upload PDF
        </div>
      </div>
    </div>
  );
};

export default NewPodPage;
