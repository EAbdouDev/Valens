"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChatPanel } from "./chat-panel";
import { ChatMessages } from "./chat-messages";
import { useUIState } from "ai/rsc";

type ChatProps = {
  id?: string;
  query?: string;
};

export function Chat({ id, query }: ChatProps) {
  const path = usePathname();
  const [messages] = useUIState();

  // useEffect(() => {
  //   if (!path.includes("search") && messages.length === 1) {
  //     window.history.replaceState({}, "", `/v/search/${id}`);
  //   }
  // }, [id, path, messages, query]);

  return (
    <div className=" max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4 p-2  ">
      <ChatMessages messages={messages} />
      <ChatPanel messages={messages} query={query} />
    </div>
  );
}
