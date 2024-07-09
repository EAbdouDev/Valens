"use client";
import { FC, useEffect, useState } from "react";
import { getAllNotes } from "./actions";
import Link from "next/link";

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
    <>
      {notes.map((note) => (
        <Link
          href={`/v/notes/${note.slug}`}
          className="p-4 bg-[#181818] rounded-xl font-semibold"
        >
          {note.title}
        </Link>
      ))}
    </>
  );
};

export default NotesList;
