import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { CoreMessage } from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

enum AgeCategory {
  Young = "young",
  Old = "old",
  Elder = "elder",
}

enum Gender {
  Male = "male",
  Female = "female",
}

interface VoiceModelMapping {
  [key: string]: { [key in Gender]: string };
}

const voiceModelMapping: VoiceModelMapping = {
  [AgeCategory.Young]: {
    [Gender.Male]: "8JVbfL6oEdmuxKn5DK2C",
    [Gender.Female]: "AD3S0eYTo2vFxZoBZino",
  },
  [AgeCategory.Old]: {
    [Gender.Male]: "AD3S0eYTo2vFxZoBZino",
    [Gender.Female]: "QwvsCFsQcnpWxmP1z7V9",
  },
  [AgeCategory.Elder]: {
    [Gender.Male]: "jlxRlLAHFHYYF59Lyibs",
    [Gender.Female]: "hv0qs3BLjcfZpVctM167",
  },
};

export function getVoiceModelId(age: number, gender: Gender): string {
  let category: AgeCategory;

  if (age < 30) {
    category = AgeCategory.Young;
  } else if (age < 60) {
    category = AgeCategory.Old;
  } else {
    category = AgeCategory.Elder;
  }

  return voiceModelMapping[category][gender];
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
