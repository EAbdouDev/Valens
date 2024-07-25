"use client";

import { FC } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import NotesList from "./NotesList";
import PublicNoteList from "./PublicNoteList";

interface NoteContainerProps {}

const NoteTabs: FC<NoteContainerProps> = ({}) => {
  return (
    <Tabs
      aria-label="Cat"
      variant="underlined"
      color="primary"
      className="w-full"
    >
      <Tab key="my_notes" title="My Notes" className="w-full">
        <header className="my-6 ">
          <h1 className="text-2xl font-bold">My Notes</h1>
        </header>
        <NotesList />
      </Tab>
      <Tab key="browse" title="Browse Notes" className="w-full">
        <header className="my-6 ">
          <h1 className="text-2xl font-bold">Browse Notes</h1>
        </header>

        <PublicNoteList />
      </Tab>
    </Tabs>
  );
};

export default NoteTabs;
