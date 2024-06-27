import { Users } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
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
  const formattedDate = DateTime.fromISO(group.createdAt).toRelative();

  return (
    <Link
      key={group.id}
      href={`/t/groups/${group.id}`}
      className="p-4 rounded-lg space-y-2 border "
    >
      <span className="p-2 rounded-full flex justify-center items-center bg-slate-100 w-fit">
        <Users />
      </span>
      <h1 className="text-xl font-semibold max-w-full truncate">
        {group.name}
      </h1>
      <div className="flex justify-between items-center w-full">
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
