import GroupsList from "@/components/teacher/groups/GroupsList";
import NewGroup from "@/components/teacher/groups/NewGroup";
import { Metadata } from "next";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "Groups",

  description: "An assistant to help medical studnets.",
};

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full">
      <header className="mb-16 space-y-2">
        <h1 className="text-2xl font-semibold">Groups</h1>
        <p className="font-light">
          Use groups to assign cases to multiple users.{" "}
        </p>
      </header>

      <GroupsList />
    </div>
  );
};

export default page;
