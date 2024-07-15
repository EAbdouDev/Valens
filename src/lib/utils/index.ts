import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { CoreMessage } from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getModel(useSubModel = false) {
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;
  const google = createGoogleGenerativeAI({ apiKey: googleApiKey });
  return google("models/gemini-1.5-pro-latest");
}

/**
 * Takes an array of AIMessage and modifies each message where the role is 'tool'.
 * Changes the role to 'assistant' and converts the content to a JSON string.
 * Returns the modified messages as an array of CoreMessage.
 *
 * @param aiMessages - Array of AIMessage
 * @returns modifiedMessages - Array of modified messages
 */
export function transformToolMessages(messages: CoreMessage[]): CoreMessage[] {
  return messages.map((message) =>
    message.role === "tool"
      ? {
          ...message,
          role: "assistant",
          content: JSON.stringify(message.content),
          type: "tool",
        }
      : message
  ) as CoreMessage[];
}
