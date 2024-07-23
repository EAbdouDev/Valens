"use client";
import { FC, useEffect, useState } from "react";
import { getAllUserNotes } from "./actions";
import Link from "next/link";
import New from "./New";
import UserNoteCard from "./UserNoteCard";
import { useAuth } from "../auth/auth-provider";

interface NotesListProps {}

const NotesList: FC<NotesListProps> = ({}) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (!auth?.currentUser) return;
        const notes = await getAllUserNotes(auth.currentUser.uid);
        if (notes.length > 0) {
          setNotes(notes);
        }

        setIsLoading(false);
      } catch (e) {
        console.error("Failed to fetch notes:", e);
      }
    };

    fetchNotes();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 w-full h-full ">
        <div className="p-4  rounded-lg font-semibold  min-h-[100px] animate-pulse bg-gray-200" />
        <div className="p-4  rounded-lg font-semibold  min-h-[100px] animate-pulse bg-gray-200" />
        <div className="p-4  rounded-lg font-semibold  min-h-[100px] animate-pulse bg-gray-200" />
        <div className="p-4  rounded-lg font-semibold  min-h-[100px] animate-pulse bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-4 w-full  ">
      {notes.length > 0 && (
        <>
          <New />
          {notes.map((note) => (
            <UserNoteCard note={note} key={note.slug} />
          ))}
        </>
      )}

      {notes.length === 0 && (
        <div>
          Start creating new notes <New />
        </div>
      )}
    </div>
  );
};

export default NotesList;
