import { Metadata } from "next";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "Dashboard",

  description: "An assistant to help medical studnets.",
};

const TeacherDashboard: FC<pageProps> = async ({}) => {
  // const res = await fetch(`${process.env.APP_URL}/api/items`);

  // let items;
  // if (res.ok) {
  //   const itemsJson = await res.json();
  //   items = itemsJson;
  // }

  // console.log(items);
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard </h1>
      <div className="min-w-96 min-h-96 mt-10 bg-white rounded-2xl shadow-[rgba(0, 0, 0, 0.1)_0px_10px_50px] "></div>
    </div>
  );
};

export default TeacherDashboard;
