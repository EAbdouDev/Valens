"use client";
import { FC } from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import useNote from "@/zuztand/notesState";

interface BlockTextEditorProps {}

const BlockTextEditor: FC<BlockTextEditorProps> = ({}) => {
  const editor = useCreateBlockNote();
  const { setText } = useNote();

  return (
    <BlockNoteView editor={editor} onChange={() => setText(editor.document)} />
  );
};

export default BlockTextEditor;
