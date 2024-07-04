"use client";

import { FC, useState, useEffect } from "react";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { MentionsInput, Mention } from "react-mentions";
import axios from "axios";
import { useAuth } from "@/components/auth/auth-provider";
import { getAuth } from "firebase/auth";
import Cookies from "js-cookie";

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

const TeacherDashboard: FC<PageProps> = ({}) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<any>({});
  const [users, setUsers] = useState([]);
  const [idToken, setIdToken] = useState<string>("");
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  console.log(idToken);

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

    // Get the access token from Firebase auth
    if (currentUser) {
      currentUser
        .getIdToken()
        .then((token) => {
          setIdToken(token);
        })
        .catch((error) => {
          console.error("Error getting access token:", error);
        });
    }
  }, [currentUser]);

  const handleInputChange = (
    event: any,
    newValue: string,
    newPlainTextValue: string
  ) => {
    setInput(newValue);

    // Extract the query for the mention
    const mentionMatch = newPlainTextValue.match(/@\w*$/);
    if (mentionMatch) {
      const query = mentionMatch[0].substring(1); // Remove the '@' from the query
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
        TimeZone: z.string().nullable(),
      }),
      End: z.object({
        DateTime: z.string().nullable(),
        TimeZone: z.string().nullable(),
      }),
      Recurrence: z.string().nullable(),
      Attendees: z.array(z.object({ Email: z.string() })),
    });

    try {
      const { object } = await generateObject({
        model: google("models/gemini-1.5-pro-latest"),
        schema: schema,
        prompt: `Extract important information from the following text: "${input}"`,
      });

      setOutput(object);
      await createGoogleCalendarEvent(object);
    } catch (error) {
      console.error("Error generating object:", error);
    }
  };

  const createGoogleCalendarEvent = async (eventData: any) => {
    if (!idToken) {
      console.error("No access token available");
      return;
    }

    const event = {
      summary: eventData.Summary,
      location: eventData.Location,
      description: eventData.Description,
      start: {
        dateTime: eventData.Start.DateTime,
        timeZone: eventData.Start.TimeZone,
      },
      end: {
        dateTime: eventData.End.DateTime,
        timeZone: eventData.End.TimeZone,
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
      <h1 className="text-3xl font-bold">Dashboard</h1>
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
        {output && (
          <pre className="mt-4 p-4 bg-gray-100 rounded-lg">
            {JSON.stringify(output, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
