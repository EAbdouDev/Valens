"use client";
import { FC, useState } from "react";
import { mergeAttributes } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import Gapcursor from "@tiptap/extension-gapcursor";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import Collaboration from "@tiptap/extension-collaboration";
import Mention from "@tiptap/extension-mention";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import Toolbar from "./Toolbar";
import useTextPod from "@/zuztand/TextEditorPod";
import NoteToolbar from "./NoteToolbar";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import useNote from "@/zuztand/notesState";

interface NoteEditorProps {
  content: any;
}

const NoteEditor: FC<NoteEditorProps> = ({ content }) => {
  const [contents, setContents] = useState<string>(content);
  const [imageSrc, setImageSrc] = useState("");
  const { setText, setEditorObj } = useNote();
  const extensions = [
    StarterKit,
    Typography,
    FontFamily,
    TextStyle,
    Youtube.configure({
      controls: false,
      progressBarColor: "yellow",
      ivLoadPolicy: 3,
      nocookie: true,
      HTMLAttributes: {
        class: "rounded-lg mx-auto",
      },
    }),
    Mention.configure({
      renderHTML({ options, node }) {
        return [
          "a",
          mergeAttributes(
            { href: `/test/${options.HTMLAttributes["data-id"]}` },
            options.HTMLAttributes
          ),
          `${node.attrs.label ?? node.attrs.id}`,
        ];
      },
      HTMLAttributes: {
        class: "mention",
      },
    }),
    Heading.configure({ levels: [1, 2] }).extend({
      levels: [1, 2],
      renderHTML({ node, HTMLAttributes }) {
        const level = this.options.levels.includes(node.attrs.level)
          ? node.attrs.level
          : this.options.levels[0];
        const classes = {
          1: "text-2xl lg:text-3xl pb-4",
          2: "text-xl lg:text-2xl pb-4",
          3: "text-lg lg:text-xl pb-4",
        };
        return [
          `h${level}`,
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
            //@ts-ignore
            class: `${classes[level]}`,
          }),
          0,
        ];
      },
    }),
    Text,
    Underline,
    Image.configure({
      HTMLAttributes: {
        class: "rounded-md  max-w-full lg:max-w-2xl mx-auto my-4 p-4",
      },
    }),
    Highlight,
    Paragraph.configure({
      HTMLAttributes: {
        class: "text-[18px]",
      },
    }),
    Gapcursor,
    Link.configure({
      openOnClick: true,
      autolink: true,
      HTMLAttributes: {
        class: "underline text-blue-500 cursor-pointer",
      },
    }),
    BulletList.configure({
      HTMLAttributes: {
        class: "list-disc  pl-8  mb-4 space-y-4",
      },
      itemTypeName: "listItem",
    }),
    OrderedList.configure({
      HTMLAttributes: {
        class: " list-decimal ml-8 mb-4 space-y-4",
      },
      keepAttributes: true,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph", "image"],
      alignments: ["left", "center", "right", "justify"],
    }),
    Placeholder.configure({
      placeholder: "You can type here (supports md)...",
      emptyEditorClass: "is-editor-empty",
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: "table-auto min-w-full max-w-full",
      },
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: " font-medium dark:border-neutral-500 ",
      },
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: " text-lg font-semibold uppercase text-gray-400 bg-gray-50",
      },
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: "border p-2",
      },
    }),
    Blockquote.configure({
      HTMLAttributes: {
        class: "bg-primary/20 p-4 rounded-xl",
      },
    }),
  ];

  const editor = useEditor({
    extensions,
    onUpdate: ({ editor }) => {
      setContents(editor.getHTML());
      setEditorObj(editor.getJSON());
      const content = editor.getText();
      setText(content);
    },
    editorProps: {
      attributes: {
        class: `leading-loose  rounded-md min-h-screen flex flex-col flex-grow min-w-full  p-6  outline-none`,
      },
      handleClickOn: (view, pos, node) => {
        if (node.type.name === "image") {
          setImageSrc(node.attrs.src);
        }
      },
    },
  });

  return (
    <div className="overflow-auto">
      <div className="border-b">
        <NoteToolbar editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default NoteEditor;
