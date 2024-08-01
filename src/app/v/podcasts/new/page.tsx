"use client";

import { useState, useEffect, useRef, FC } from "react";
import TextEditor from "@/components/editor/TextEditor";
import Header from "@/components/podcasts/Header";
import useTextPod from "@/zuztand/TextEditorPod";
import { Loader2, Sparkle } from "lucide-react";
import { ScrollShadow } from "@nextui-org/react";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

interface pageProps {}

const NewPodPage: FC<pageProps> = ({}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { aiText, isGenerating, text } = useTextPod();
  const [conversation, setConversation] = useState<
    { speaker: string; text: string }[]
  >([]);

  useEffect(() => {
    setShowSidebar(false);
  }, []);
  useEffect(() => {
    if (aiText) {
      try {
        setConversation(aiText);
        setShowSidebar(true);
      } catch (error) {
        console.error("Failed to parse AI text", error);
      }
    }
  }, [aiText]);

  useEffect(() => {
    if (isGenerating) {
      setShowSidebar(true);
    }
  }, [isGenerating]);

  // Function to render the conversation
  const renderConversation = () => {
    if (!conversation) return null;

    return conversation.map((entry, index) => (
      <div
        key={index}
        className={`mb-2  ${
          entry.speaker === "aya"
            ? "bg-rose-50 dark:bg-transparent dark:border "
            : "bg-purple-50 dark:bg-transparent dark:border"
        } rounded-lg p-4 flex flex-col justify-start items-start gap-2`}
      >
        <p className=" opacity-80 font-bold">
          {entry.speaker.charAt(0).toUpperCase() + entry.speaker.slice(1)}
        </p>{" "}
        <p className="font-normal">
          {entry.text.replaceAll('<break time="1.0s" />', " ")}
        </p>
      </div>
    ));
  };

  return (
    <div className="min-h-full flex flex-col h-full">
      <header>
        {" "}
        <Header />
      </header>
      {/* <!-- main container --> */}
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <main className="flex-1  overflow-y-auto">
          {" "}
          <TextEditor />
        </main>

        {/* <nav class="order-first sm:w-32 bg-purple-200 overflow-y-auto">Sidebar</nav> */}

        {showSidebar && (
          <aside
            className={`sm:w-[35%] overflow-y-auto ${
              isGenerating || aiText ? "border-l" : ""
            } `}
          >
            {isGenerating && (
              <div className="flex-1 h-full  px-6 py-8 w-full ">
                <div className="icon">
                  <Sparkle className=" animate-spin duration-1000 transition-all ease-soft-spring mb-4 text-blue-500" />
                </div>
                <div className="loader_container space-y-2">
                  <div className="loading-bar gradient-1 dark:gradient-1 animate-loading rounded-xl" />
                  <div className="loading-bar gradient-2 dark:gradient-2 animate-loading rounded-xl" />
                  <div className="loading-bar gradient-3 dark:gradient-3 animate-loading rounded-xl" />
                </div>

                <div className=" mt-10 text-center opacity-50 text-sm">
                  <p>Gemini is working on the script...</p>
                  <p>This usually takes 2 min or less.</p>
                </div>
              </div>
            )}
            <ScrollShadow hideScrollBar>
              {aiText && (
                <div className="flex-1   h-full w-full px-6 pb-10 pt-4 mb-10 ">
                  <h1 className="text-2xl font-medium mb-6 ">Podcast script</h1>
                  <div className="pb-10">{renderConversation()}</div>
                </div>
              )}
            </ScrollShadow>
          </aside>
        )}
      </div>
      {/* <!-- end main container --> */}

      {/* <footer class="bg-gray-100">Footer</footer> */}
    </div>
  );
};

export default NewPodPage;
