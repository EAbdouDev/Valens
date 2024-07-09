import { Metadata } from "next";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "MindMaps",

  description: "An assistant to help medical studnets.",
};

const page: FC<pageProps> = ({}) => {
  return <div>MindMaps</div>;
};

export default page;
