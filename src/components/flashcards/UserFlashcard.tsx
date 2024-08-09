import {
  Earth,
  EarthLock,
  EllipsisVertical,
  File,
  FileText,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { auth } from "../../../firebase/client";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button, Tooltip } from "@nextui-org/react";

interface NoteCardProps {
  flashcard: any;
}

const getTimeDifference = (date: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 604800;
  if (interval > 1) return Math.floor(interval) + " weeks ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return "Just now";
};

const UserFlashcard: FC<NoteCardProps> = ({ flashcard }) => {
  const [timeAgo, setTimeAgo] = useState(
    getTimeDifference(flashcard.createdAt)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeDifference(flashcard.createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [flashcard.createdAt]);

  return (
    <Link
      prefetch={false}
      href={`/v/flashcards/${flashcard.id}`}
      className="bg-white dark:bg-[#1a1a1a] hover:scale-105 transition-all ease-soft-spring shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px] dark:shadow-none dark:border rounded-2xl p-4 flex flex-col justify-start items-start gap-2"
    >
      <div className="w-full flex justify-between items-center gap-x-4 mb-2">
        <Zap className="w-6 h-6" />
      </div>
      <Tooltip
        content={flashcard.title}
        placement="top"
        color="primary"
        delay={1000}
      >
        <h1 className="text-lg font-semibold max-w-full truncate">
          {flashcard.title}
        </h1>
      </Tooltip>

      <div className="w-full flex justify-between items-center gap-x-4 mt-2">
        <p className="text-xs text-gray-500">{timeAgo}</p>
      </div>
    </Link>
  );
};

export default UserFlashcard;
