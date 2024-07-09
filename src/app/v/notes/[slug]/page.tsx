import TextEditor from "@/components/editor/TextEditor";
import { FC } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = ({ params }) => {
  return (
    <div className=" w-full h-full bg-[#f9f9f9] dark:bg-[#181818] rounded-lg">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={50} maxSize={75}>
          <TextEditor />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={40} maxSize={50} className="p-4">
          AI
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default page;
