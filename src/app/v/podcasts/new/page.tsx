"use client";

import { useState, useEffect, useRef, FC } from "react";
import TextEditor from "@/components/editor/TextEditor";
import { generatePodcastScript } from "@/components/podcasts/actions";
import Header from "@/components/podcasts/Header";
import useTextPod from "@/zuztand/TextEditorPod";
import { Loader2 } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface pageProps {}

const NewPodPage: FC<pageProps> = ({}) => {
  const { aiText, isGenerating, text } = useTextPod();
  const [conversation, setConversation] = useState<
    { speaker: string; text: string }[]
  >([]);

  useEffect(() => {
    if (aiText) {
      try {
        setConversation(aiText);
      } catch (error) {
        console.error("Failed to parse AI text", error);
      }
    }
  }, [aiText]);

  // Function to render the conversation
  const renderConversation = () => {
    if (!conversation) return null;

    return conversation.map((entry, index) => (
      <div key={index} className="mb-4">
        <p>
          <strong>
            {entry.speaker.charAt(0).toUpperCase() + entry.speaker.slice(1)}:
          </strong>{" "}
          {entry.text}
        </p>
      </div>
    ));
  };

  return (
    <div className="space-y-4 w-full h-full relative">
      <Header />
      <div className="flex justify-start items-start gap-6 w-full h-full px-6">
        <div className="flex-1 h-full rounded-2xl">
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
    </div>
  );
};

export default NewPodPage;
