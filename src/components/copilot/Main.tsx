"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrainCircuit, Plus, SendHorizontal, X } from "lucide-react";

import { FC } from "react";
import ChatScrollAnchor from "./ChatScrollAnchor";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEnterSubmit } from "@/lib/use-enter-submit";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { useActions, useUIState } from "ai/rsc";
import { AI } from "./actions";
import { UserMessage } from "./llm/message";
import ChatLists from "./ChatLists";

const chatSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export type ChatInput = z.infer<typeof chatSchema>;

interface MainProps {}

const Main: FC<MainProps> = ({}) => {
  const form = useForm<ChatInput>();
  const { formRef, onKeyDown } = useEnterSubmit();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { sendMessage } = useActions<typeof AI>();

  const onSubmit: SubmitHandler<ChatInput> = async (data: any) => {
    const value = data.message.trim();
    formRef.current?.reset();

    if (!value) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        role: "user",
        display: <UserMessage>{value}</UserMessage>,
      },
    ]);

    try {
      const responseMessage = await sendMessage(value);
      setMessages((currentMessages) => [...currentMessages, responseMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <BrainCircuit />
      </SheetTrigger>
      <SheetContent className="!m-4 rounded-xl border flex flex-col ">
        <SheetHeader className="">
          <SheetTitle className="flex justify-between items-center  mb-2">
            <h1 className="text-2xl">Valens Copilot</h1>
            <button
              className="px-4 py-2 border-2 rounded-lg flex justify-center items-center gap-2 text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
            >
              <Plus />
              New Chat
            </button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden mt-2 rounded-2xl bg-white dark:bg-[#101010] p-6">
          <ChatLists messages={messages} />
          <ChatScrollAnchor />
        </div>

        <div className="w-full mt-auto">
          <form
            action={""}
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2"
          >
            <div className="relative w-full ">
              <TextareaAutosize
                tabIndex={0}
                onKeyDown={onKeyDown}
                placeholder="Copilot is ready to help you..."
                className="w-full bg-white dark:bg-[#101010]  rounded-2xl p-4  resize-none min-h-[60px] sm:text-sm"
                autoFocus
                spellCheck
                autoComplete="off"
                autoCorrect="off"
                rows={1}
                {...form.register("message")}
              />
              <button
                type="submit"
                disabled={form.watch("message") === ""}
                className="absolute right-2 top-5 disabled:opacity-30 disabled:cursor-not-allowed transition-all ease-in-out bg-transparent border-none p-0"
              >
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          </form>
          <p className="text-xs opacity-60 font-light text-center mt-2">
            Copilot can give false responses.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Main;
