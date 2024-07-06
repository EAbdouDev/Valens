"use client";
import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface DayEventsListsProps {
  id: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  creator: { email: string; self: boolean };
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees: string;
}

const DayEventsLists: FC<DayEventsListsProps> = ({
  id,
  htmlLink,
  created,
  updated,
  summary,
  description,
  creator,
  start,
  end,
  attendees,
}) => {
  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateTime: string) => {
    const date = new Date(dateTime);
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "short" });
    const dayOfMonth = date.getDate().toString().padStart(2, "0");
    return { dayOfWeek, dayOfMonth };
  };

  const startTime = formatTime(start.dateTime);
  const endTime = formatTime(end.dateTime);
  const { dayOfWeek, dayOfMonth } = formatDate(start.dateTime);

  return (
    <Link
      href={
        "https://www.google.com/calendar/event?eid=cHJ1djVmNmJrZ25tYmY0cjRuOHFwanVkMGcgZXNsYW1hYmRvdWRldkBt"
      }
      target="_blank"
      className="w-full p-2 rounded-xl border flex justify-start items-center gap-4 overflow-hidden bg-white dark:bg-[#141414] hover:opacity-80 transition-all ease-soft-spring"
    >
      <div className="border-r flex flex-col justify-center items-center gap-1 min-w-[20%] max-w-[20%] pr-4">
        <p className="text-sm text-violet-600">{dayOfWeek}</p>
        <h1 className="text-xl font-semibold">{dayOfMonth}</h1>
      </div>
      <div className="flex-1 flex justify-start items-start gap-6 max-w-full">
        <div className="flex flex-col justify-start items-start gap-2 opacity-70 flex-none">
          <div className="flex justify-center items-center gap-3 flex-none">
            <Clock className="w-4 h-4" />
            <p className="text-xs">{`${startTime} - ${endTime}`}</p>
          </div>
          <div className="flex justify-center items-center gap-3 flex-none">
            <MapPin className="w-4 h-4" />
            <p className="text-xs">Georgia</p>
          </div>
        </div>

        <div className="flex flex-col justify-start items-start gap-2 max-w-full">
          <div className="max-w-full truncate">
            <h1 className="max-w-full truncate text-sm font-semibold">
              {summary}
            </h1>
          </div>

          <div className="max-w-full truncate">
            <p className="text-xs   opacity-60 font-light ">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DayEventsLists;
