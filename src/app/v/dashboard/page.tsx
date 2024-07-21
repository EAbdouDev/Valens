"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Chart } from "@/components/dashboard/Chart";
import { FC } from "react";

interface PageProps {}

const CalendarComponent: FC<PageProps> = ({}) => {
  const auth = useAuth();
  const currentUser = auth?.currentUser;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold capitalize ">
        Hey {currentUser?.displayName}
      </h1>

      <div className="mt-10 ">
        <Chart />
      </div>
    </div>
  );
};

export default CalendarComponent;
