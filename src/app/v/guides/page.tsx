"use client";

import { useState } from "react";
import { AI, ClientMessage } from "../../../../core/action";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { useAuth } from "@/components/auth/auth-provider";
import { SendHorizontal } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const auth = useAuth();

  return (
    <div className=" max-w-5xl mx-auto  h-full p-4  rounded-2xl flex flex-col overflow-y-auto">
      <div className="flex-1 space-y-6 overflow-y-auto">
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.role === "user" ? (
              <div className="flex justify-start items-start gap-4">
                <img
                  src={auth?.currentUser?.photoURL || ""}
                  className="w-7 h-7 rounded-full"
                />
                <p className="font-medium p-2 bg-gray-100 rounded-lg ">
                  {message.display}
                </p>
              </div>
            ) : (
              <div className="flex justify-start items-start gap-4">
                <img
                  src={
                    "https://www.gstatic.com/lamda/images/gemini_sparkle_red_4ed1cbfcbc6c9e84c31b987da73fc4168aec8445.svg"
                  }
                  className="w-7 h-7 rounded-full bg-gray-100 p-1"
                />
                <p className="font-medium p-2 bg-gray-100 rounded-lg ">
                  {message.display}
                </p>
              </div>
            )}
            {/* {message.role}: {message.display} */}
          </div>
        ))}
      </div>

      <form
        className="mt-auto flex justify-center items-center gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setInput("");
          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            { id: nanoid(), role: "user", display: input },
          ]);

          const message = await continueConversation(input);

          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            message,
          ]);
        }}
      >
        <input
          type="text"
          className="bg-gray-100 flex-1 p-2 border rounded-md"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          placeholder="Write to Gemini and ask him about a good time to study..."
        />
        <button className="bg-blue-600 p-2 rounded-lg text-white">
          <SendHorizontal />
        </button>
      </form>
    </div>
  );
}
