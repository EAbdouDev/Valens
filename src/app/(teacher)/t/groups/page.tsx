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
      {/* <NewGroup /> */}

      <GroupsList />
    </div>
  );
};

export default page;
