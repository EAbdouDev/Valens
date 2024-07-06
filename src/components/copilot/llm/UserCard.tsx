"use client";

import { FC } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Send } from "lucide-react";

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  pic: string;
  message?: string;
}

const UserCard: FC<UserCardProps> = ({ id, name, email, pic, message }) => {
  return (
    <div className="w-full max-w-md flex items-center gap-6 border  rounded-lg p-4 bg-gray-100 dark:bg-[#262626]">
      <Avatar className="w-12 h-12">
        <AvatarImage src={pic || "/placeholder-user.jpg"} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-grow grid gap-1">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{email}</div>
      </div>
      <div className="flex flex-shrink-0 items-end mr-4">
        <Link
          href={`/v/m/${id}`}
          className="text-sm flex justify-center items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <Send className="w-4 h-4" /> Message
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
