import { Metadata } from "next";
import { FC } from "react";
import NoteTabs from "@/components/notes/NoteTabs";

interface NotesPageProps {}

export const maxDuration = 60;
export const metadata: Metadata = {
  title: "Notes",

  description: "An assistant to help medical studnets.",
};

const NotesPage: FC<NotesPageProps> = ({}) => {
  return (
    <div className="p-8 w-full h-full container">
      <NoteTabs />
    </div>
  );
};

export default NotesPage;
