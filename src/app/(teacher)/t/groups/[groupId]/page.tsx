import GroupUsersTable from "@/components/teacher/groups/GroupUsersTable";
import { FC } from "react";

interface pageProps {
  params: {
    groupId: string;
  };
}

const page: FC<pageProps> = ({ params }) => {
  return (
    <div>
      <GroupUsersTable groupId={params.groupId} />
    </div>
  );
};

export default page;
