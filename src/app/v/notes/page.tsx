import New from "@/components/notes/New";
import NotesList from "@/components/notes/NotesList";
import { Metadata } from "next";
import { FC } from "react";

interface NotesPageProps {}

export const maxDuration = 300;
export const metadata: Metadata = {
  title: "Notes",

  description: "An assistant to help medical studnets.",
};

const NotesPage: FC<NotesPageProps> = ({}) => {
  return (
    <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 w-full ">
      <New />
      <NotesList />
    </div>
  );
};

export default NotesPage;
