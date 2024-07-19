"use clinet";

import { Toggle } from "@/components/ui/toggle";
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

interface ToolbarProps {
  editor: Editor | null;
}

const Toolbar: FC<ToolbarProps> = ({ editor }) => {
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

  // useEffect(() => {
  //   const fetchNotes = async () => {
  //     const { data: teamId, error: teamIdError } = await supabase
  //       .from("teams")
  //       .select("id")
  //       .eq("name", userProfile.selected_team);
  //     if (teamIdError) {
  //       toast.error(teamIdError.message);
  //       console.log(teamIdError.message);
  //       return;
  //     }

  //     const { data: courses, error: coursesError } = await supabase
  //       .from("courses_team")
  //       .select("*, courses:course_id(slug)")
  //       .eq("team_id", teamId[0].id);
  //     if (coursesError) {
  //       toast.error(coursesError.message);
  //       console.log(coursesError.message);
  //       return;
  //     }

  //     const coursesSlugs = courses.map((course: any) => course.courses.slug);

  //     const { data: notes, error: notesError } = await supabase
  //       .from("notes")
  //       .select("*")
  //       .in("course_slug", coursesSlugs);
  //     if (notesError) {
  //       toast.error(notesError.message);
  //       console.log(notesError.message);
  //       return;
  //     }

  //     setNotes(notes);
  //   };

  //   fetchNotes();
  // }, []);

  // const handleEdit = () => {
  //   if (editor && editor.chain && isSelected) {
  //     editor.chain().focus().updateAttributes("internalLink", attributes).run();
  //     setOpen(false);
  //   }
  // };

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

  if (!editor) {
    return null;
  }

  return (
    <div className=" flex justify-between items-center w-full ">
      <div className=" transition-all ease-soft-spring   rounded-lg flex flex-wrap p-4  justify-start items-center gap-4 ">
        <div className="  flex gap-4">
          <button
            type="button"
            onClick={() => editor.commands.undo()}
            className=" hover:scale-105 transition-all ease-soft-spring"
          >
            <Undo2 className=" w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => editor.commands.redo()}
            className=" hover:scale-105 transition-all ease-soft-spring"
          >
            <Redo2 className=" w-5 h-5" />
          </button>
        </div>

        <div className="">
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

        <div className="">
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

        <div className=" ">
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

                <label
                  htmlFor="file-upload"
                  className="cursor-pointer  w-full p-2 rounded-md border-2 flex justify-center items-center "
                >
                  Upload from my PC
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setSelectedImages(files);
                    const previews: string[] = [];
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        previews.push(reader.result as string);
                        if (previews.length === files.length) {
                          setImagePreviews(previews);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  style={{ display: "none" }}
                />

                <div className="flex justify-start items-center flex-wrap gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="mt-4 flex items-center relative"
                    >
                      <Tooltip content={selectedImages[index].name}>
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-[80px] h-[80px] rounded-lg mr-2 bg-white object-contain cursor-pointer"
                        />
                      </Tooltip>
                      {/* 
                    <span className="truncate">
                      {selectedImages[index].name}
                    </span> */}

                      <button
                        onClick={() => {
                          const newImages = [...selectedImages];
                          newImages.splice(index, 1);
                          setSelectedImages(newImages);

                          const newPreviews = [...imagePreviews];
                          newPreviews.splice(index, 1);
                          setImagePreviews(newPreviews);
                        }}
                        className="ml-auto text-sm text-white cursor-pointer absolute -top-2 right-0 bg-black/80 backdrop-blur-md p-1 rounded-md"
                      >
                        <X className=" w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className=" flex justify-end mt-6">
                  <Button onClick={addImage} color="secondary">
                    Insert Image
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
