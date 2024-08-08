"use client";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { updateTitle } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useNote from "@/zuztand/notesState";
import { Checkbox, Switch, Tooltip } from "@nextui-org/react";

import {
  collection,
  query,
  getDocs,
  where,
  doc,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../../../firebase/client";
import { ArrowLeft, Cloud, SaveIcon, Trash2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

interface NoteHeaderProps {
  slug: string;
  note: any;
}

const NoteHeader: FC<NoteHeaderProps> = ({ slug, note }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMounted, setIsMounted] = useState(false);
  const [isStudied, setIsStudied] = useState(note.studied);
  const [title, setTitle] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const { text, editorObj } = useNote();

  useEffect(() => {
    setIsMounted(true);
  }, [slug]);

  useEffect(() => {
    setTitle(note.title);
    setIsStudied(note.studied);
  }, []);

  const handleSave = async () => {
    if (!firestore) return;

    try {
      setIsLoading(true);
      // Find the document by slug
      const notesQuery = query(
        collection(firestore, "notes"),
        where("slug", "==", slug)
      );
      const querySnapshot = await getDocs(notesQuery);

      if (!querySnapshot.empty) {
        const batch = writeBatch(firestore);
        querySnapshot.forEach((docSnapshot) => {
          const noteRef = doc(firestore!, "notes", docSnapshot.id);
          batch.update(noteRef, {
            content: editorObj,
          });
        });
        await batch.commit();
        toast.message(`Note updated successfully`);
      } else {
        toast.error(`No note found with the slug: ${slug}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to update note: ${error}`);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!firestore) return;

    try {
      setIsDeleting(true);
      // Find the document by slug
      const notesQuery = query(
        collection(firestore, "notes"),
        where("slug", "==", slug)
      );
      const querySnapshot = await getDocs(notesQuery);

      if (!querySnapshot.empty) {
        const batch = writeBatch(firestore);
        querySnapshot.forEach((docSnapshot) => {
          const noteRef = doc(firestore!, "notes", docSnapshot.id);
          batch.delete(noteRef);
        });
        await batch.commit();
        toast.message(`Note deleted successfully`);
        router.push("/v/notes");
      } else {
        toast.error(`No note found with the slug: ${slug}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to delete note: ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStudiedChange = async (value: boolean) => {
    setIsStudied(value);
    if (!firestore) return;

    try {
      // Find the document by slug
      const notesQuery = query(
        collection(firestore, "notes"),
        where("slug", "==", slug)
      );
      const querySnapshot = await getDocs(notesQuery);

      if (!querySnapshot.empty) {
        const batch = writeBatch(firestore);
        querySnapshot.forEach((docSnapshot) => {
          const noteRef = doc(firestore!, "notes", docSnapshot.id);
          batch.update(noteRef, {
            studied: value,
          });
        });
        await batch.commit();
        toast.message(`Studied status updated successfully`);
      } else {
        toast.error(`No note found with the slug: ${slug}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to update studied status: ${error}`);
    }
  };

  const onSubmitName = (e: FormEvent) => {
    e.preventDefault();
    if (!title) return;
    updateTitle(note.id, title);
    setIsEditing(false);
    router.refresh();

    toast.message("Note title updated.");

    if (title === "") {
      setTitle(note.title);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!title) return;
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        if (title.trim() !== note.title.trim()) {
          updateTitle(note.id, title);
          toast.success("Note title updated.");
        }
        setIsEditing(false);
        if (title === "") {
          setTitle(note.title);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title, note]);

  return (
    <header className="h-[60px] w-full  px-2 flex justify-between items-center  transition-all ease-soft-spring ">
      <div className=" max-w-[60%] flex justify-start items-center gap-4">
        <Button
          onPress={() => router.back()}
          isIconOnly
          variant="light"
          size="sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {!title && (
          <div className="h-14 w-full rounded-lg bg-gray-100 animate-pulse" />
        )}
        {!isEditing && (
          <Tooltip content="Rename" color="primary">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full max-w-full truncate font-medium text-lg border p-1 rounded-lg border-transparent hover:border-muted "
            >
              {title}
            </button>
          </Tooltip>
        )}

        {isEditing && (
          <form onSubmit={onSubmitName} className="w-full">
            <input
              ref={inputRef}
              type="text"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 rounded-lg border w-full"
              autoFocus
            />
          </form>
        )}
      </div>

      <div className="flex justify-end items-center gap-4">
        <div className="p-2 bg-muted rounded-lg">
          <Checkbox isSelected={isStudied} onValueChange={handleStudiedChange}>
            Studied
          </Checkbox>
        </div>
        <Button
          variant="bordered"
          color="primary"
          onPress={handleSave}
          isLoading={isLoading}
          className="flex justify-center items-center gap-2"
        >
          <SaveIcon className="w-5 h-5" /> Save
        </Button>
        <div>
          <Button
            variant="light"
            color="danger"
            onPress={onOpen}
            className="flex justify-center items-center gap-2"
          >
            <Trash2 className="w-5 h-5" /> Delete
          </Button>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Delete Note
                  </ModalHeader>
                  <ModalBody>
                    <p>Are you sure you want to delete this note?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button
                      isDisabled={isDeleting}
                      color="danger"
                      variant="solid"
                      onPress={() => {
                        handleDelete();
                        onClose();
                      }}
                      isLoading={isDeleting}
                    >
                      Confirm
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>

        {/* <NoteSettings note={note} /> */}
      </div>
    </header>
  );
};

export default NoteHeader;
