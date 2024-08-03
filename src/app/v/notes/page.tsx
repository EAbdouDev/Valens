import { Metadata } from "next";
import { FC } from "react";
import NotesList from "@/components/notes/NotesList";

interface NotesPageProps {}

export const maxDuration = 60;
export const metadata: Metadata = {
  title: "Notes",

  description: "An assistant to help medical studnets.",
};

const NotesPage: FC<NotesPageProps> = ({}) => {
  return (
    <div className="p-8 w-full  container">
      <header className="mt-6 mb-8 ">
        <h1 className="text-2xl 2xl:text-3xl font-bold">My Notes</h1>
      </header>
      <NotesList />
    </div>
  );
};

export default NotesPage;
