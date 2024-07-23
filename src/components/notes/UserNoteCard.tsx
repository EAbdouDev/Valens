import { EllipsisVertical, File, FileText } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { auth } from "../../../firebase/client";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button } from "@nextui-org/react";

interface NoteCardProps {
  note: any;
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

const UserNoteCard: FC<NoteCardProps> = ({ note }) => {
  const [timeAgo, setTimeAgo] = useState(getTimeDifference(note.createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeDifference(note.createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [note.createdAt]);

  return (
    <div className="shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px] dark:border rounded-lg p-4 flex flex-col justify-start items-start gap-2">
      <div className="w-full flex justify-between items-center gap-x-4 mb-2">
        <FileText className="w-6 h-6" />
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Button isIconOnly variant="light" size="sm">
              <EllipsisVertical className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">Popover Content</div>
              <div className="text-tiny">This is the popover content</div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Link
        prefetch={false}
        href={`/v/notes/${note.slug}`}
        className="text-lg font-semibold hover:underline max-w-full truncate"
      >
        {note.title}
      </Link>

      <p className="text-sm font-light max-w-full line-clamp-2 opacity-70">
        {note.description ? note.description : "No description was provided"}
      </p>
      <div className="w-full flex justify-between items-center gap-x-4 mt-2">
        <p className="text-xs text-gray-500">Created by You</p>
        <p className="text-xs text-gray-500">{timeAgo}</p>
      </div>
    </div>
  );
};

export default UserNoteCard;
