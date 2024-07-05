import CasesList from "@/components/teacher/cases/CasesList";
import { Metadata } from "next";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "Cases",

  description: "An assistant to help medical studnets.",
};

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full">
      <header className="mb-16 space-y-2">
        <h1 className="text-2xl font-semibold">Cases</h1>
        <p className="font-light">
          Just enter the disease name and let Gemini create a full case for you,
          you can customize it further.
        </p>
      </header>

      <CasesList />
    </div>
  );
};

export default page;
