"use client";
import { FC, useEffect, useState } from "react";
import { getAllUserNotes } from "./actions";
import Link from "next/link";
import New from "./New";
import UserNoteCard from "./UserNoteCard";
import { useAuth } from "../auth/auth-provider";
import NewButton from "./NewButton";
import { Loader2 } from "lucide-react";

interface NotesListProps {}

const NotesList: FC<NotesListProps> = ({}) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!auth?.currentUser) return;
      setIsLoading(true);
      try {
        const fetchedNotes = await getAllUserNotes(auth.currentUser.uid);
        setNotes(fetchedNotes);
      } catch (e) {
        console.error("Failed to fetch notes:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [auth?.currentUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center flex-grow w-full h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const showEmptyState = notes.length === 0 && !isLoading;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full h-full">
        {notes.length > 0 && (
          <>
            <New />
            {notes.map((note) => (
              <UserNoteCard note={note} key={note.slug} />
            ))}
          </>
        )}
      </div>
      {showEmptyState && (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex flex-col items-center justify-center flex-grow">
            <img
              src="/images/empty_state_notes.png"
              alt="empty_state"
              className="w-[20%] h-auto"
            />
            <div className="opacity-60 text-center">
              <p>There're no notes for you to see yet.</p>
              <p>Start creating your first note.</p>
            </div>
            <div className="w-fit mt-6">
              <NewButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotesList;
