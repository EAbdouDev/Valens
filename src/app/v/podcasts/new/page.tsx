"use client";

import { useState, useEffect, useRef } from "react";
import TextEditor from "@/components/editor/TextEditor";
import { generatePodcastScript } from "@/components/podcasts/actions";
import Header from "@/components/podcasts/Header";
import useTextPod from "@/zuztand/TextEditorPod";
import { Loader2 } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FC } from "react";

interface pageProps {}

const NewPodPage: FC<pageProps> = ({}) => {
  const { aiText, isGenerating, text } = useTextPod();
  const [conversation, setConversation] = useState<{
    eslam: string[];
    aya: string[];
  } | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const tippyRef = useRef<any>(null);

  useEffect(() => {
    if (aiText) {
      try {
        setConversation(aiText);
      } catch (error) {
        console.error("Failed to parse AI text", error);
      }
    }
  }, [aiText]);

  // Function to handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setSelectedText(text);
        setMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + window.scrollY - 10,
        });
        setMenuVisible(true);
      }
    } else {
      setSelectedText(null);
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
    };
  }, []);

  // Function to render the conversation
  const renderConversation = () => {
    if (!conversation) return null;

    const { eslam, aya } = conversation;

    const dialogue = [];

    for (let i = 0; i < Math.max(eslam.length, aya.length); i++) {
      if (i < eslam.length) {
        dialogue.push(
          <div key={`eslam-${i}`} className="mb-4">
            <p>
              <strong>Eslam:</strong> {eslam[i]}
            </p>
          </div>
        );
      }
      if (i < aya.length) {
        dialogue.push(
          <div key={`aya-${i}`} className="mb-4">
            <p>
              <strong>Aya:</strong> {aya[i]}
            </p>
          </div>
        );
      }
    }

    return dialogue;
  };

  return (
    <div className="space-y-4 w-full h-full relative">
      <Header />
      <div className="flex justify-start items-start gap-6 w-full h-full">
        <div className="flex-1 h-full rounded-xl border">
          <TextEditor />
        </div>
        {isGenerating && (
          <div className="flex-1 h-full rounded-xl border p-4">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {aiText && (
          <div className="flex-1 h-fit rounded-xl p-4">
            {isGenerating && <Loader2 className="animate-spin" />}
            <div>{renderConversation()}</div>
          </div>
        )}
      </div>
      {menuVisible && menuPosition && (
        <Tippy
          content={
            <div>
              <button className="p-1">Option 1</button>
              <button className="p-1">Option 2</button>
            </div>
          }
          visible={menuVisible}
          placement="top"
          reference={tippyRef}
          interactive={true}
          onClickOutside={() => setMenuVisible(false)}
        >
          <span
            ref={tippyRef}
            style={{
              position: "absolute",
              left: menuPosition.x,
              top: menuPosition.y,
            }}
          ></span>
        </Tippy>
      )}
    </div>
  );
};

export default NewPodPage;
