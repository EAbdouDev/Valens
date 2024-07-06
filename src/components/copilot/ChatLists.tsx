"use client";
import { FC } from "react";
import { UIState } from "./actions";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useAuth } from "../auth/auth-provider";

interface chatListsProps {
  messages: UIState;
}

const ChatLists: FC<chatListsProps> = ({ messages }) => {
  const auth = useAuth();
  if (!messages.length)
    return (
      <div className="p-4 w-full h-full">
        <h1 className="text-2xl font-medium">
          <span className="opacity-50">Welcome</span>{" "}
          {auth?.currentUser?.displayName}{" "}
        </h1>

        <div className="flex flex-col justify-center items-center grow w-full h-full opacity-50">
          I am your copilot, how may I help you?
        </div>
      </div>
    );
  return (
    <ScrollShadow className="w-full h-full" hideScrollBar>
      <div className="relative ">
        {messages.map((message) => (
          <div key={message.id} className="pb-8">
            {message.display}
          </div>
        ))}
      </div>
    </ScrollShadow>
  );
};

export default ChatLists;
