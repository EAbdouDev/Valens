import { Metadata } from "next";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "Cases",

  description: "An assistant to help medical studnets.",
};

const page: FC<pageProps> = ({}) => {
  return <div>Cases</div>;
};

export default page;
