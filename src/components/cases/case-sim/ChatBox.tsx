"use client";

import useCaseSim from "@/zuztand/CaseSimState";
import { FC, useState } from "react";

interface ChatBoxProps {
  patient_name: string;
  onSubmit: (input: string) => void;
}

const ChatBox: FC<ChatBoxProps> = ({ patient_name, onSubmit }) => {
  const { isListening, setIsListening } = useCaseSim();
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(input);
      setInput(""); // Clear input field after submission
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="w-full">
      <input
        name="chatbox"
        className="border rounded-l-xl rounded-r-sm p-3 outline-none w-full disabled:opacity-60 disabled:cursor-wait transition-all ease-in-out"
        placeholder={`${
          isListening
            ? `${patient_name} is listening to you...`
            : `Talk to ${patient_name}...`
        }`}
        disabled={isListening}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default ChatBox;
