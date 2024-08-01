import {
  ClipboardPlus,
  Earth,
  EarthLock,
  EllipsisVertical,
  File,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { auth } from "../../../firebase/client";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button, Tooltip } from "@nextui-org/react";

interface NoteCardProps {
  caseData: any;
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

const UserCaseCard: FC<NoteCardProps> = ({ caseData }) => {
  const [timeAgo, setTimeAgo] = useState(getTimeDifference(caseData.updatedAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeDifference(caseData.updatedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [caseData.updatedAt]);

  return (
    <div className="shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px] dark:border rounded-lg  flex flex-col justify-start items-start gap-2">
      <div className="w-full flex justify-between items-center gap-x-4 mb-2">
        <ClipboardPlus className="w-5 h-5" />
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Button isIconOnly variant="light" size="sm">
              <EllipsisVertical className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="">
              <Button variant="light" color="danger">
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Tooltip
        content={caseData.title}
        placement="top"
        color="primary"
        delay={1000}
      >
        <Link
          prefetch={false}
          href={`/s/case/${caseData.id}/pre`}
          className="text-lg font-semibold hover:underline max-w-full truncate p-4"
        >
          {caseData.title}
        </Link>
      </Tooltip>

      <div className="w-full flex justify-between items-center gap-x-4 mt-2">
        {/* {note.isPublic && (
            <div className="flex justify-center items-center gap-2 text-xs px-2 py-1 bg-green-200 rounded-lg">
              <Earth className="w-4 h-4" />
              <p>Public</p>
            </div>
          )}
  
          {!note.isPublic && (
            <div className="flex justify-center items-center gap-2 text-xs px-2 py-1 bg-yellow-200 rounded-lg">
              <EarthLock className="w-4 h-4" />
              <p>Private</p>
            </div>
          )} */}

        <p className="text-xs text-gray-500 p-4">{timeAgo}</p>
      </div>
    </div>
  );
};

export default UserCaseCard;
