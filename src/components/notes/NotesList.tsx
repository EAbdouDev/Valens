"use client";
import { FC, useEffect, useState } from "react";
import { getAllNotes } from "./actions";
import Link from "next/link";
import New from "./New";

interface NotesListProps {}

const NotesList: FC<NotesListProps> = ({}) => {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await getAllNotes();
        setNotes(notes);
      } catch (e) {
        console.error("Failed to fetch notes:", e);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 w-full h-full ">
      {notes.length > 0 && (
        <>
          <New />
          {notes.map((note) => (
            <Link
              href={`/v/notes/${note.slug}`}
              className="p-4  rounded-lg font-semibold  border min-h-[100px]"
            >
              {note.title}
            </Link>
          ))}
        </>
      )}

      {notes.length === 0 && (
        <>
          <div className="p-4  rounded-lg font-semibold  min-h-[100px] animate-pulse bg-gray-200" />
          <div className="p-4  rounded-lg font-semibold  min-h-[100px] animate-pulse bg-gray-200" />
          <div className="p-4  rounded-lg font-semibold  min-h-[100px] animate-pulse bg-gray-200" />
          <div className="p-4  rounded-lg font-semibold  min-h-[100px] animate-pulse bg-gray-200" />
        </>
      )}
    </div>
  );
};

export default NotesList;
