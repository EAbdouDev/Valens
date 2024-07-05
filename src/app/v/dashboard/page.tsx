"use client";

import { FC, useState, useEffect } from "react";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";
import { MentionsInput, Mention } from "react-mentions";
import axios from "axios";
import { useAuth } from "@/components/auth/auth-provider";
import { CalendarRange } from "lucide-react";
import { motion } from "framer-motion";

interface PageProps {}

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
});

const customStyle = {
  control: {
    backgroundColor: "#fff",
    fontSize: 16,
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  input: {
    margin: 0,
  },
  "&multiLine": {
    control: {
      fontFamily: "monospace",
      minHeight: 63,
    },
    highlighter: {
      padding: 9,
      border: "1px solid transparent",
    },
    input: {
      padding: 9,
      border: "1px solid silver",
    },
  },
  "&singleLine": {
    display: "inline-block",
    width: 180,
  },
  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      fontSize: 14,
    },
    item: {
      padding: "5px 15px",
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      "&focused": {
        backgroundColor: "#cee4e5",
      },
    },
  },
};

const CalendarComponent: FC<PageProps> = ({}) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [idToken, setIdToken] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("");
  const auth = useAuth();
  const currentUser = auth?.currentUser;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        if (response.data && response.data.users) {
          setUsers(
            response.data.users.map((user: any) => ({
              id: user.email,
              display: `${user.name} (${user.email})`,
            }))
          );
        } else {
          console.log("No users data received from API");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();

    if (currentUser) {
      currentUser
        .getIdToken(true)
        .then((token) => {
          setIdToken(token);
        })
        .catch((error) => {
          console.error("Error getting access token:", error);
        });
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(timezone);
  }, [currentUser]);

  const handleInputChange = (
    event: any,
    newValue: string,
    newPlainTextValue: string
  ) => {
    setInput(newValue);

    const mentionMatch = newPlainTextValue.match(/@\w*$/);
    if (mentionMatch) {
      const query = mentionMatch[0].substring(1);
      searchUsers(query);
    } else {
      setUsers([]);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query) {
      setUsers([]);
      return;
    }

    try {
      const response = await axios.get(`/api/users`, {
        params: {
          searchTerm: query,
        },
      });

      if (response.data && response.data.users) {
        setUsers(
          response.data.users.map((user: any) => ({
            id: user.email,
            display: `${user.name} (${user.email})`,
          }))
        );
      } else {
        console.log("No users data received from API");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getImportantData = async () => {
    const schema = z.object({
      Summary: z.string(),
      Location: z.string().nullable(),
      Description: z.string().nullable(),
      Start: z.object({
        DateTime: z.string(),
        TimeZone: z.string().nullable().default(timezone),
      }),
      End: z.object({
        DateTime: z.string().nullable(),
        TimeZone: z.string().nullable().default(timezone),
      }),
      Recurrence: z.string().nullable(),
      Attendees: z.array(z.object({ Email: z.string() })),
    });

    try {
      const { partialObjectStream } = await streamObject({
        model: google("models/gemini-1.5-pro-latest"),
        schema: schema,
        prompt: `Extract important information from the following text to use this data for the calendar and generate a description based on this data: "${input}"`,
      });

      for await (const partialObject of partialObjectStream) {
        setOutput(partialObject);
      }

      // await createGoogleCalendarEvent(output);
    } catch (error) {
      console.error("Error generating object:", error);
    }
  };

  const createGoogleCalendarEvent = async (eventData: any) => {
    if (!idToken) {
      console.error("No access token available");
      return;
    }

    if (!output) {
      return;
    }
    console.log("starting creating to google");

    const event = {
      summary: eventData.Summary,
      location: eventData.Location,
      description: eventData.Description,
      start: {
        dateTime: eventData.Start?.DateTime,
        timeZone: eventData.Start?.TimeZone,
      },
      end: {
        dateTime: eventData.End?.DateTime,
        timeZone: eventData.End?.TimeZone,
      },
      attendees: eventData.Attendees.map((attendee: any) => ({
        email: attendee.Email,
      })),
    };

    try {
      const response = await axios.post("/api/calendar/event", {
        idToken,
        event,
      });
      console.log("Event created:", response.data);
    } catch (error) {
      console.error("Error creating calendar event:", error);
    }
  };

  return (
    <div>
      <div className="mt-10 rounded-2xl bg-white p-4">
        <h1 className="text-xl font-semibold">AI + Google Calendar</h1>
        <MentionsInput
          value={input}
          onChange={handleInputChange}
          style={customStyle}
          placeholder="Start scheduling with AI..."
          className="w-full border rounded-lg h-full mt-8"
          rows={5}
        >
          <Mention
            trigger="@"
            data={users}
            displayTransform={(id, display) => `@${display}`}
            appendSpaceOnAdd={true}
          />
        </MentionsInput>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={getImportantData}
        >
          Extract Information
        </button>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => createGoogleCalendarEvent(output)}
        >
          Send to calander
        </button>
        {output && (
          <motion.div
            className="mt-4 p-4 bg-gray-100 rounded-lg flex justify-start items-start max-w-[30%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-shrink-0 mt-2">
              <CalendarRange className="w-7 h-7" />
            </div>
            <div className="ml-4 space-y-2 mt-2">
              <p className="text-xl font-semibold capitalize">
                {output.Summary}
              </p>
              {output.Start?.DateTime && output.End?.DateTime && (
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    Starts on{" "}
                    {new Date(output.Start.DateTime)
                      .toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace(",", " at")}{" "}
                  </p>
                  <p>
                    Ends on{" "}
                    {new Date(output.End.DateTime)
                      .toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace(",", " at")}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-600">{output.Location}</p>
              <p className="text-sm text-gray-600">
                {output.Attendees?.map((a: any) => (
                  <p
                    className="flex justify-start items-center gap-2"
                    key={a.Email}
                  >
                    <img
                      src="https://lh3.googleusercontent.com/a/AEdFTp4yFBlws2C_IzHMo-tCaHM4OhCSjOVhMoULB1RC=s96-c"
                      className="rounded-full w-7 h-7"
                      alt={a.Email}
                    />{" "}
                    {a.Email}
                  </p>
                ))}
              </p>
            </div>
          </motion.div>
        )}

        <div className="bg-gray-100 p-4 rounded-xl mt-8">
          <pre>{JSON.stringify(output, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
