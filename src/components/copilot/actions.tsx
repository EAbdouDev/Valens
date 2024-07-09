"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { CoreMessage, ToolInvocation } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { ReactNode } from "react";
import { BotCard, BotMessage } from "./llm/message";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { parseRelativeDate, sleep } from "@/lib/utils";
import { firestore } from "../../../firebase/server";
import UserCard from "./llm/UserCard";
import { google as gapi } from "googleapis";
import DayEventsList from "./llm/DayEventsList";
import { MemoizedReactMarkdown } from "./markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const content = `
    You are a Valens copilot, which means an assistant for Valens webapp users. You can help users create events in Google Calendar and show today's events, beside that you can chat with users if they didn't ask for event creation or to get today events 

    it's better to let the user feel comfortable so you can call him/her with their name, here is the username: eslamabdou
    Messages inside [] mean that it's a UI element or a user event. For example:
    
    - "[Event created: Meeting with Dr. Smith]" means that the interface of the created Google Calendar event titled 'Meeting with Dr. Smith' is shown to the user.
    - "[Adding attendee: user@example.com]" means that the interface of adding an attendee with the email 'user@example.com' to the event is shown to the user.
    - "[Today's events]" means that the interface of today's Google Calendar events is shown to the user.
    
    If the user writes the attendee's name, use \`get_users_email\` to add the user email to the event object.

    Here is how you can help users:
    - When the user wants to create an event, get the event details from the user such as title, date, time, and description.
    - If the user mentions attendees by name, call \`get_users_email\` to retrieve their email addresses and add them to the event.
    - Confirm the event details with the user before creating the event.
    - After creating the event, show a confirmation message to the user with the event details.
    - If the user wants to see today's events, call \`get_events_for_day\` and display the events to the user.

    For example:
    User: "Create an event titled 'Project Meeting' on July 10th at 2 PM with Dr. John Doe and Dr. Jane Smith."
    Assistant: "[Creating event: Project Meeting on July 10th at 2 PM]"
    Assistant: "[Adding attendee: Dr. John Doe]"
    Assistant: "[Adding attendee: Dr. Jane Smith]"
    Assistant: "Event 'Project Meeting' on July 10th at 2 PM with Dr. John Doe and Dr. Jane Smith has been created."

    User: "Show me today's events."
    Assistant: "[Fetching today's events]"
    Assistant: "[Today's events: Meeting with Dr. Smith at 10 AM, Lunch with team at 1 PM, Project update at 3 PM]"
    
    If the user wants to add an attendee, call \`get_users_email\`.
    If the user wants to see today's events, call \`get_events_for_day\`.
`;

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
});

export const sendMessage = async (
  message: string
): Promise<{
  id: number;
  role: "user" | "assistant";
  display: ReactNode;
}> => {
  const history = getMutableAIState<typeof AI>();
  history.update([
    ...history.get(),
    {
      role: "user",
      content: message,
    },
  ]);

  try {
    const replay = await streamUI({
      model: google("models/gemini-1.5-pro-latest"),
      messages: [
        { role: "system", content: content, toolInvocations: [] },
        ...history.get(),
      ] as CoreMessage[],
      initial: (
        <BotMessage className="items-center flex-shrink-0 select-none justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
        </BotMessage>
      ),
      text: ({ content, done }) => {
        if (done) history.done([...history.get(), { role: "system", content }]);

        return (
          <BotMessage>
            <MemoizedReactMarkdown
              className="prose break-words prose-p:leading-relaxed prose-pre:p-0"
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
              }}
            >
              {content}
            </MemoizedReactMarkdown>
          </BotMessage>
        );
      },
      temperature: 0,
      tools: {
        get_users_email: {
          description:
            "Get the user email of a given user name. use this to get the user email from the username that user will give",
          parameters: z.object({
            username: z
              .string()
              .describe(
                "get the username to get the useremail. e.g. eslamabdou, if you can't get the username ask the user to write 'username:' then the username"
              ),
          }),
          generate: async function* ({ username }: { username: string }) {
            yield (
              <BotCard>
                <p className="font-mono">Checking the username...</p>
              </BotCard>
            );
            const res = await getUserEmail(
              username.replaceAll(" ", "").toLowerCase()
            );
            const email = res.status === "success" && res.email;

            const pic = res.status === "success" && res.pic;

            const id = res.status === "success" && res.id;

            await sleep(2000);
            history.done([
              ...history.get(),
              {
                role: "system",
                name: "get_users_email",
                content: email,
              },
            ]);
            return (
              <BotCard>
                {res.status === "success" && (
                  <div className="flex flex-col justify-start items-start gap-2">
                    <UserCard email={email} name={username} pic={pic} id={id} />
                    <p className="mt-2">
                      Here is the user card, you can message him directly.
                    </p>
                  </div>
                )}
                {res.status === "error" &&
                  "Can't find the email associated with this username, please check the username and try again. "}
              </BotCard>
            );
          },
        },
        get_todays_events: {
          description:
            "Get the user events from the google calander of a given day. use this to get the user events from the day that user will give, if the user didn't provide a day ask him for it ",
          parameters: z.object({
            day: z.string().describe("the day of the event"),
          }),

          generate: async function* ({ day }: { day: string }) {
            console.log(day);
            yield (
              <BotCard>
                <p className="font-mono">Getting the data...</p>
              </BotCard>
            );

            await sleep(2000);

            const res = await getEventsForDay(day);

            history.done([
              ...history.get(),
              {
                role: "system",
                name: "get_events_for_day",
                content: day,
              },
            ]);
            return (
              <BotCard>
                {res.length > 0 && <DayEventsList events={res} />}
              </BotCard>
            );
          },
        },
      },
    });

    return {
      id: Date.now(),
      role: "assistant",
      display: replay.value,
    };
  } catch (error) {
    console.error("Error during message processing:", error);
    return {
      id: Date.now(),
      role: "assistant",
      display: (
        <BotMessage>I have some issues now, please try again later</BotMessage>
      ),
    };
  }
};

export type AIState = Array<{
  id?: number;
  name?: "get_events_for_day" | "get_users_email";
  role: "user" | "assistant" | "system";
  content: string;
}>;

export type UIState = Array<{
  id: number;
  role: "user" | "assistant";
  display: ReactNode;
  toolInvocations?: ToolInvocation[];
}>;

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    sendMessage,
  },
});

interface UserSuccessResponse {
  status: "success";
  id: any;
  email: any;
  pic: any;
}

interface UserErrorResponse {
  status: "error";
  message: string;
}

type UserResponse = UserSuccessResponse | UserErrorResponse;

const getUserEmail = async (username: string): Promise<UserResponse> => {
  if (!firestore || !username) {
    return {
      status: "error",
      message: `${username} is not a friend of yours. I can invite them!`,
    };
  }

  try {
    const normalizedUsername = username.trim().toLowerCase();
    const usersCollection = firestore.collection("users");
    const querySnapshot = await usersCollection
      .where("name", "==", normalizedUsername)
      .get();

    if (querySnapshot.empty) {
      return {
        status: "error",
        message: `${username} is not a friend of yours. I can invite them!`,
      };
    }

    const userDoc = querySnapshot.docs[0];
    const userEmail = userDoc.data().email;
    const userPic = userDoc.data().picture;
    const userId = userDoc.data().id;

    return { status: "success", id: userId, email: userEmail, pic: userPic };
  } catch (error) {
    console.error("Error getting user email: ", error);
    return {
      status: "error",
      message: `Error occurred while fetching the email for ${username}`,
    };
  }
};

const getEventsForDay = async (day: string): Promise<any> => {
  const oAuth2Client = new gapi.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS
  );

  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const calendar = gapi.calendar({ version: "v3", auth: oAuth2Client });

  let startOfDay, endOfDay;
  try {
    const date = parseRelativeDate(day);
    console.log(date);
    startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);
  } catch (error) {
    console.error("Invalid date input:", error);
    return [];
  }
  const eventsList = await calendar.events.list({
    calendarId: "primary",
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  console.log(eventsList.data.items);

  return eventsList.data.items;
};
