"use client";
import { FC, useEffect, useState } from "react";
import { getAllUserNotes } from "./actions";
import Link from "next/link";
import New from "./New";
import UserNoteCard from "./UserNoteCard";
import { useAuth } from "../auth/auth-provider";
import NewButton from "./NewButton";

interface NotesListProps {}

const NotesList: FC<NotesListProps> = ({}) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        if (!auth?.currentUser) return;
        const notes = await getAllUserNotes(auth.currentUser.uid);
        if (notes.length > 0) {
          setNotes(notes);
        }
      } catch (e) {
        console.error("Failed to fetch notes:", e);
      }
    };

    fetchNotes();
    setIsLoading(false);
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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  gap-4 w-full h-full">
        {notes.length > 0 && (
          <>
            <New />
            {notes.map((note) => (
              <UserNoteCard note={note} key={note.slug} />
            ))}
          </>
        )}
      </div>
      {notes.length === 0 && (
        <div className="flex flex-col justify-center items-center w-full h-full  ">
          <div className="flex flex-col items-center justify-center flex-grow">
            <img
              src="/images/empty_state_notes.png"
              alt="empty_state"
              className="w-[20%] h-auto"
            />
            <div className="opacity-60 text-center">
              <p>There're no notes for you to see yet.</p>
              <p>
                Start creating new note, or you can browse the community notes.
              </p>
            </div>
            <div className="w-fit mt-6">
              {" "}
              <NewButton />
            </div>
            {/* <New /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default NotesList;
