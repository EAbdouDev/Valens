"use client";

import { FC, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useAuth } from "@/components/auth/auth-provider";
import Link from "next/link";
import GroupCard from "./GroupCard";
import { Loader2, Plus } from "lucide-react";

interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: string;
  createdBy: string;
}

const GroupsList: FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const userId = auth?.currentUser?.uid;
  useEffect(() => {
    const fetchGroups = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/getGroups?userId=${userId}`);
          const data = await response.json();
          setGroups(data.groups);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching groups:", error);
          setIsLoading(false);
        }
      }
    };

    fetchGroups();
  }, [userId]);

  return (
    <div className="w-full h-full">
      <h1 className="text-lg font-semibold opacity-80">My Groups</h1>
      {isLoading && (
        <div className="flex flex-col justify-center items-center flex-grow w-full h-full">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {groups.length === 0 && !isLoading ? (
        <p>No groups found</p>
      ) : (
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 w-full h-full mt-4">
          {!isLoading && groups.length !== 0 && (
            <Link
              href={"/t/groups/new"}
              className="flex flex-col justify-center items-center border-2 border-dashed gap-4 rounded-lg hover:bg-slate-100 transition-all ease-in-out"
            >
              <Plus /> <p className="text-lg font-medium">New Group</p>
            </Link>
          )}
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsList;
