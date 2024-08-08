"use clinet";

import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BadgeCent,
  Bold,
  FileText,
  GitMerge,
  Heading,
  Highlighter,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Table,
  TextQuote,
  Underline,
  Undo2,
  Video,
  WandSparkles,
  X,
} from "lucide-react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Input, Tooltip } from "@nextui-org/react";
import Youtube from "@tiptap/extension-youtube";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import useNote from "@/zuztand/notesState";
import { tidyNote } from "../notes/agents/actions";

interface ToolbarProps {
  editor: Editor | null;
}

const NoteToolbar: FC<ToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const [openImageModel, setOpenImageModel] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});
  const [open, setOpen] = useState(false);
  const [imageURLink, setImageURLLink] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [notes, setNotes] = useState<any>(null);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isLoadingContent, setisLoadingContent] = useState(false);
  const [selectedHtml, setSelectedHtml] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<any>();
  const { isTidy, setIsTidy, setTidyText, editorObj } = useNote();

  const addImage = useCallback(() => {
    // const url = window.prompt("URL");

    if (imageURL) {
      editor.chain().focus().setImage({ src: imageURL }).run();

      setOpenImageModel(false);
      setImageURL("");
    }

    if (selectedImages) {
    }
  }, [editor, imageURL]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const widthRef = useRef(null);
  const heightRef = useRef(null);

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 800,
        height: 480,
      });
    }
  };

  const handleTidy = async () => {
    setIsTidy(true);
    const res = await tidyNote(editorObj);
    if (res) {
      setTidyText(res);
      setIsTidy(false);
    }
  };
  if (!editor) {
    return null;
  }

  return (
    <div className=" flex justify-between items-center w-full ">
      <div className=" transition-all ease-soft-spring   rounded-lg flex flex-wrap p-2  justify-start items-center gap-4 ">
        <div className="  flex ">
          <button
            type="button"
            onClick={() => editor.commands.undo()}
            className=" hover:bg-[#cacaca] dark:hover:bg-[#393939] rounded-lg p-2 transition-all ease-soft-spring"
          >
            <Undo2 className=" w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => editor.commands.redo()}
            className=" hover:bg-[#cacaca] dark:hover:bg-[#393939] rounded-lg p-2 transition-all ease-soft-spring"
          >
            <Redo2 className=" w-5 h-5" />
          </button>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full hover:opacity-60 flex justify-center items-center">
              <Heading className=" w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" z-[2000]">
              <DropdownMenuLabel>Headings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Toggle
                  className="w-full flex justify-start items-center gap-2 text-2xl"
                  size={"sm"}
                  pressed={editor.isActive("heading", { level: 1 })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                >
                  Heading 1
                </Toggle>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Toggle
                  className="w-full flex justify-start items-center gap-2 text-xl "
                  size={"sm"}
                  pressed={editor.isActive("heading", { level: 2 })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                >
                  Heading 2
                </Toggle>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Toggle
                  className="w-full flex justify-start items-center gap-2 text-lg "
                  size={"sm"}
                  pressed={editor.isActive("heading", { level: 3 })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                >
                  Heading 3
                </Toggle>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Toggle
                  className="w-full flex justify-start items-center gap-2 text-lg "
                  size={"sm"}
                  pressed={editor.isActive("heading", { level: 4 })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                  }
                >
                  Heading 4
                </Toggle>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-1">
          <Toggle
            size={"sm"}
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className=" w-5 h-5" />
          </Toggle>
          <Toggle
            size={"sm"}
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className=" w-5 h-5" />
          </Toggle>
          <Toggle
            size={"sm"}
            pressed={editor.isActive("underline")}
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
          >
            <Underline className=" w-5 h-5" />
          </Toggle>
        </div>

        <div className="flex gap-1">
          <Toggle
            size={"sm"}
            pressed={editor.isActive({ textAlign: "left" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
          >
            <AlignLeft className=" w-5 h-5" />
          </Toggle>
          <Toggle
            size={"sm"}
            pressed={editor.isActive({ textAlign: "center" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
          >
            <AlignCenter className=" w-5 h-5" />
          </Toggle>
          <Toggle
            size={"sm"}
            pressed={editor.isActive({ textAlign: "right" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
          >
            <AlignRight className=" w-5 h-5" />
          </Toggle>

          <Toggle
            size={"sm"}
            pressed={editor.isActive({ textAlign: "justify" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("justify").run()
            }
          >
            <AlignJustify className=" w-5 h-5" />
          </Toggle>
        </div>

        <div className="flex gap-1 ">
          <Toggle
            size={"sm"}
            pressed={editor.isActive("highlight")}
            onPressedChange={() =>
              editor.chain().focus().toggleHighlight().run()
            }
          >
            <Highlighter className=" w-5 h-5" />
          </Toggle>
          <Toggle
            size={"sm"}
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className=" w-5 h-5" />
          </Toggle>

          <button
            type="button"
            onClick={setLink}
            className={`ml-2 hover:opacity-50 ${
              editor.isActive("link") ? " text-blue-500" : ""
            }`}
          >
            <Link className="w-5 h-5" />
          </button>
        </div>

        <div>
          <Dialog open={openImageModel} onOpenChange={setOpenImageModel}>
            <DialogTrigger className=" flex justify-center items-center">
              <Image className="w-6 h-6" />
            </DialogTrigger>
            <DialogContent className="p-4">
              <DialogHeader>
                <DialogTitle>Insert an image</DialogTitle>
              </DialogHeader>

              <div className="w-full">
                <Input
                  variant="bordered"
                  label="Image URL"
                  className="my-4"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                />

                <div className=" flex justify-end mt-6">
                  <Button onClick={addImage} color="secondary">
                    Insert Image
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <button
          className="ml-6 px-4 py-2 rounded-lg flex justify-start items-center gap-2 hover:bg-[#ededed] dark:hover:bg-[#4e4e4e]  "
          onClick={handleTidy}
          disabled={isTidy}
        >
          {isTidy ? (
            <>
              <WandSparkles className="w-5 h-5" />
              <p>Tidying...</p>
            </>
          ) : (
            <>
              <WandSparkles className="w-5 h-5" />
              <p>Tidy</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NoteToolbar;
