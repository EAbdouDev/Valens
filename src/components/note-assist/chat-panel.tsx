"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { AI, UIState } from "@/app/actions";
import { useUIState, useActions, useAIState } from "ai/rsc";
import { cn } from "@/lib/utils";
import { UserMessage } from "./user-message";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { EmptyScreen } from "./empty-screen";
import Textarea from "react-textarea-autosize";
import { generateId } from "ai";
import { useAppState } from "@/lib/utils/app-state";

interface ChatPanelProps {
  messages: UIState;
  query?: string;
}

export function ChatPanel({ messages, query }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [showEmptyScreen, setShowEmptyScreen] = useState(false);
  const [, setMessages] = useUIState<typeof AI>();
  const [aiMessage, setAIMessage] = useAIState<typeof AI>();
  const { isGenerating, setIsGenerating } = useAppState();
  const { submit } = useActions();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isFirstRender = useRef(true); // For development environment

  async function handleQuerySubmit(query: string, formData?: FormData) {
    setInput(query);
    setIsGenerating(true);

    // Add user message to UI state
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: generateId(),
        component: <UserMessage message={query} />,
      },
    ]);

    // Submit and get response message
    const data = formData || new FormData();
    if (!formData) {
      data.append("input", query);
    }
    const responseMessage = await submit(data);
    setMessages((currentMessages) => [...currentMessages, responseMessage]);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleQuerySubmit(input, formData);
  };

  // if query is not empty, submit the query
  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      handleQuerySubmit(query);
      isFirstRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const lastMessage = aiMessage.messages.slice(-1)[0];
    if (lastMessage?.type === "followup" || lastMessage?.type === "inquiry") {
      setIsGenerating(false);
    }
  }, [aiMessage, setIsGenerating]);

  // Clear messages
  const handleClear = () => {
    setIsGenerating(false);
    setMessages([]);
    setAIMessage({ messages: [], chatId: "" });
    setInput("");
    // router.push("/");
  };

  useEffect(() => {
    // focus on input when the page loads
    inputRef.current?.focus();
  }, []);

  // If there are messages and the new button has not been pressed, display the new Button
  if (messages.length > 0) {
    return (
      <div className=" bottom-2 md:bottom-6 left-0 right-16   flex justify-end items-center">
        <Button
          type="button"
          variant={"secondary"}
          className="rounded-xl bg-black text-white"
          onClick={() => handleClear()}
          disabled={isGenerating}
        >
          <Plus size={18} className="" />
          <span className="text-sm ml-2 ">New</span>
        </Button>
      </div>
    );
  }

  if (query && query.trim().length > 0) {
    return null;
  }

  return (
    <div className={""}>
      <form onSubmit={handleSubmit} className="max-w-full w-full ">
        <div className="relative flex items-center w-full">
          <Textarea
            ref={inputRef}
            name="input"
            rows={1}
            maxRows={5}
            tabIndex={0}
            placeholder="Ask a question..."
            spellCheck={false}
            value={input}
            className="resize-none w-full min-h-12 !rounded-lg  border border-input pl-4 pr-10 pt-3 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 "
            onChange={(e) => {
              setInput(e.target.value);
              setShowEmptyScreen(e.target.value.length === 0);
            }}
            onKeyDown={(e) => {
              // Enter should submit the form
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                // Prevent the default action to avoid adding a new line
                if (input.trim().length === 0) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                const textarea = e.target as HTMLTextAreaElement;
                textarea.form?.requestSubmit();
              }
            }}
            // onHeightChange={(height) => {
            //   // Ensure inputRef.current is defined
            //   if (!inputRef.current) return;

            //   // The initial height and left padding is 70px and 2rem
            //   const initialHeight = 70;
            //   // The initial border radius is 32px
            //   const initialBorder = 32;
            //   // The height is incremented by multiples of 20px
            //   const multiple = (height - initialHeight) / 20;

            //   // Decrease the border radius by 4px for each 20px height increase
            //   const newBorder = initialBorder - 4 * multiple;
            //   // The lowest border radius will be 8px
            //   inputRef.current.style.borderRadius =
            //     Math.max(8, newBorder) + "px";
            // }}
            onFocus={() => setShowEmptyScreen(true)}
            onBlur={() => setShowEmptyScreen(false)}
          />
          <Button
            type="submit"
            size={"icon"}
            variant={"ghost"}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={input.length === 0}
          >
            <ArrowRight size={20} />
          </Button>
        </div>
        <EmptyScreen
          submitMessage={(message) => {
            setInput(message);
          }}
          className={cn(showEmptyScreen ? "visible" : "invisible")}
        />
      </form>
    </div>
  );
}
