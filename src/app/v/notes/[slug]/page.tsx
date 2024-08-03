import { FC } from "react";
import { AI } from "@/app/actions";
import { generateId } from "ai";
import NoteHeader from "@/components/notes/NoteHeader";
import { getNoteDetails } from "@/components/notes/actions";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import EditorSidebarTabs from "@/components/notes/EditorSidebarTabs";
import EditorAgentsTabs from "@/components/notes/EditorAgentsTabs";
import NoteEditor from "@/components/editor/NoteEditor";
import { firestore } from "../../../../../firebase/server";
import { Metadata } from "next";

export const revalidate = 0;
export const maxDuration = 60;

interface PageProps {
  params: {
    slug: string;
  };
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { params } = props;
  const { slug } = params;

  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    const notesSnapshot = await firestore
      .collection("notes")
      .where("slug", "==", slug)
      .get();

    if (notesSnapshot.empty) {
      console.error("No such document!");
      return {
        title: "Note Not Found",
      };
    }

    const note = notesSnapshot.docs[0].data();
    const title = note?.title || "Untitled Note"; // Use the title field from your document or a default value

    return {
      title,
    };
  } catch (error) {
    console.error("Error fetching document:", error);
    return {
      title: "Error",
    };
  }
};
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
        {/* <NoteHeader slug={params.slug} note={note} /> */}

        {/* <!-- main container --> */}
        <div className="flex-1 flex flex-row overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={70}>
              <div className="w-full h-full overflow-hidden">
                <nav className="lg:hidden flex border-l h-fit w-full border-b">
                  <EditorSidebarTabs />
                </nav>

                <div className="h-full">
                  <NoteEditor
                    //@ts-expect-error
                    content={note.content}
                  />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              className="hidden lg:flex h-full m-1 rounded-lg"
              maxSize={35}
              minSize={30}
              defaultSize={30}
            >
              <div className="w-full h-full overflow-auto">
                <EditorAgentsTabs noteSlug={params.slug} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          <nav className="hidden lg:flex  h-full w-fit bg-muted rounded-lg">
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
