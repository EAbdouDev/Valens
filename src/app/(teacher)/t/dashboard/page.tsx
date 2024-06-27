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
      Teacher Dashboard{" "}
      {/* {items?.map((item: any) => (
        <p>{item.title}</p>
      ))} */}
    </div>
  );
};

export default TeacherDashboard;
