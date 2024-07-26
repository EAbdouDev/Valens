"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { DateComp } from "./DateComp";
import { generateObject } from "ai";
import { dateSchema } from "./date";

import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const result = await streamUI({
    model: google("models/gemini-1.5-pro-latest"),
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      getCurrentDateTime: {
        description: "Get the current date and time",
        parameters: z.object({
          date: z.string().describe("the user  current date and time"),
          // time: z.string().describe("give the user the current time"),
        }), // Define an empty parameters object
        generate: async function* ({ date }) {
          yield <div>loading...</div>;
          const res = await generateObject({
            model: google("models/gemini-1.5-pro-latest"),
            schema: dateSchema,
            prompt: "Is this time good to study?" + date,
          });
          return <DateComp res={res.object} />;
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
