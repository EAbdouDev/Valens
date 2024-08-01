import CasesTabs from "@/components/cases/CasesTabs";
import UserCasesList from "@/components/cases/UserCasesList";
import { Metadata } from "next";
import Link from "next/link";
import { FC } from "react";

interface PageProps {}

export const metadata: Metadata = {
  title: "Cases",
  description: "An assistant to help medical students.",
};

const generateSimpleId = (length = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const CasesPage: FC<PageProps> = ({}) => {
  return (
    <div className="p-10 w-full  container">
      <CasesTabs />
      <header className="space-y-2 my-10">
        <h1 className="text-2xl font-bold">My Cases</h1>
      </header>
      <UserCasesList />
      {/* <Link href={`/v/cases/new/selector`}>New Case</Link> */}
    </div>
  );
};

export default CasesPage;
