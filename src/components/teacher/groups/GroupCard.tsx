import { Users } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { DateTime } from "luxon";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    members: string[];
    createdAt: string;
    createdBy: string;
  };
}

const GroupCard: FC<GroupCardProps> = ({ group }) => {
  const [formattedDate, setFormattedDate] = useState(
    DateTime.fromISO(group.createdAt).toRelative()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDate(DateTime.fromISO(group.createdAt).toRelative());
    }, 60000); // 60000 milliseconds = 1 minute

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [group.createdAt]);

  return (
    <Link
      key={group.id}
      href={`/t/groups/${group.id}`}
      className="p-4 rounded-lg space-y-3 border hover:bg-slate-100 transition-all ease-in-out "
    >
      <span className="p-2 rounded-full flex justify-center items-center bg-slate-100 w-fit">
        <Users />
      </span>
      <h1 className="text-xl font-medium max-w-full truncate">{group.name}</h1>
      <div className="flex justify-between items-center w-full text-sm opacity-70">
        <p>
          {group.members.length > 1
            ? `${group.members.length} Students`
            : `One Student`}
        </p>
        <p>{formattedDate}</p>
      </div>
    </Link>
  );
};

export default GroupCard;
