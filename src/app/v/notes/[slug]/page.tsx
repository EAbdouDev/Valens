import { FC, Suspense } from "react";
import { AI } from "@/app/actions";
import { Chat } from "@/components/note-assist/chat";
import { generateId } from "ai";
import BlockTextEditor from "@/components/editor/BlockTextEditor";
import NoteHeader from "@/components/notes/NoteHeader";
import { getNoteDetails } from "@/components/notes/actions";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Cookies from "js-cookie";
import EditorSidebarTabs from "@/components/notes/EditorSidebarTabs";
import EditorAgentsTabs from "@/components/notes/EditorAgentsTabs";
import NoteEditor from "@/components/editor/NoteEditor";

export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

const NewNotePage: FC<PageProps> = async ({ params }) => {
  const id = generateId();
  const note = await getNoteDetails(params.slug);

  if (!note) {
    // Handle the case where the note is not found
    return <div>Note not found</div>;
  }

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <div className="min-h-full flex flex-col h-full">
        <NoteHeader slug={params.slug} />

        {/* <!-- main container --> */}
        <div className="flex-1 flex flex-row overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <div className="w-full h-full overflow-auto">
                <nav className="lg:hidden flex border-l h-fit w-full  bg-white border-b">
                  <EditorSidebarTabs />
                </nav>
                <NoteEditor content={"dfdfdf"} />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              className=" hidden lg:flex h-full bg-[#f8f8f8]"
              maxSize={35}
              minSize={30}
            >
              <div className="w-full h-full overflow-auto">
                <EditorAgentsTabs />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          <nav className="hidden lg:flex border-l h-full w-fit bg-white">
            <EditorSidebarTabs />
          </nav>
        </div>
        {/* <!-- end main container --> */}

        {/* <footer class="bg-gray-100">Footer</footer> */}
      </div>
    </AI>
  );
};

export default NewNotePage;
