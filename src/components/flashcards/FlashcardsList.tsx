"use client";
import { FC, useEffect, useState } from "react";
import { getFlashcards } from "./actions";
import Link from "next/link";
import { useAuth } from "../auth/auth-provider";
import { Loader2, Search } from "lucide-react";
import { Input } from "@nextui-org/react";
import UserFlashcard from "./UserFlashcard";

interface NotesListProps {}

const FlashcardsList: FC<NotesListProps> = ({}) => {
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const auth = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!auth?.currentUser) return;
      setIsLoading(true);
      try {
        const fetchedNotes = await getFlashcards(auth.currentUser.uid);
        setFlashcards(fetchedNotes);
      } catch (e) {
        console.error("Failed to fetch flashcards:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [auth?.currentUser]);

  useEffect(() => {
    setSearchQuery("");
  }, [auth?.currentUser]);

  const filteredFlashcards = flashcards.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center flex-grow w-full h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const showEmptyState = filteredFlashcards.length === 0 && !isLoading;

  return (
    <>
      <header className=" mb-8 flex justify-between items-center gap-x-4 ">
        <h1 className="text-2xl 2xl:text-3xl font-bold">My Flashcards</h1>
        <Input
          placeholder="Search..."
          startContent={<Search className="w-4 h-5 opacity-70" />}
          className="max-w-[30%]  "
          variant="bordered"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full h-full">
        {filteredFlashcards.length > 0 && (
          <>
            {filteredFlashcards.map((flashcard) => (
              <UserFlashcard flashcard={flashcard} key={flashcard.id} />
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
              {searchQuery ? (
                <p>No flashcards match your search criteria.</p>
              ) : (
                <>
                  <p>There're no flashcards for you to see yet.</p>
                </>
              )}
            </div>
            {!searchQuery && (
              <div className="w-fit mt-6">
                <p>No Flashcards yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FlashcardsList;
