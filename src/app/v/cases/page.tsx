import { Metadata } from "next";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "Cases",

  description: "An assistant to help medical studnets.",
};

const CasesPage: FC<pageProps> = ({}) => {
  return (
    <div className="w-full">
      <Link href={"/v/cases/new"}>New Case</Link>
    </div>
  );
};

export default CasesPage;
