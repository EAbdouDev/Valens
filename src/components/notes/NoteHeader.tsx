"use client";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { getNoteDetails, updateTitle } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useNote from "@/zuztand/notesState";
import { Button, Skeleton } from "@nextui-org/react";
import * as tf from "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../../../firebase/client";
import { ArrowLeft } from "lucide-react";

interface NoteHeaderProps {
  slug: string;
}

const NoteHeader: FC<NoteHeaderProps> = ({ slug }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [note, setNote] = useState<any>(null);
  const [title, setTitle] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const { text, editorObj } = useNote();

  useEffect(() => {
    setIsMounted(true);

    const fetchNoteTitle = async () => {
      const note: any = await getNoteDetails(slug);
      if (note) {
        setNote(note);
        setTitle(note.title);
      }
    };

    const loadBackend = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
    };
    loadBackend();

    fetchNoteTitle();
  }, [slug]);

  const generateEmb = async () => {
    const model = await use.load();
    const embeddings = await model.embed([text]);

    const embeddingArray = embeddings.arraySync()[0];
    return embeddingArray;
  };

  const handleSave = async () => {
    if (!firestore) return;
    const vectors = await generateEmb();
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
            content: editorObj,
            embedding: vectors,
          });
        });
        await batch.commit();
        toast.success(`Note updated successfully.`);
      } else {
        toast.error(`No note found with the slug: ${slug}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to update note: ${error}`);
    }
  };

  const onSubmitName = (e: FormEvent) => {
    e.preventDefault();
    if (!title) return;
    updateTitle(note.id, title);
    setIsEditing(false);

    toast.success("Note title updated.");

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

  if (!isMounted) return null;

  return (
    <header className="h-[70px] w-full py-2 px-4 flex justify-between items-center border-b transition-all ease-soft-spring">
      <div className=" max-w-[40%] flex justify-start items-center gap-4">
        <Button
          onPress={() => router.back()}
          isIconOnly
          variant="light"
          size="sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {!title && <Skeleton className="h-14 w-full rounded-lg" />}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full max-w-full truncate "
          >
            {title}
          </button>
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

      <div>
        <Button variant="bordered" color="primary" onPress={handleSave}>
          Save
        </Button>
      </div>
    </header>
  );
};

export default NoteHeader;
