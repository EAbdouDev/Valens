import UserCasesList from "@/components/cases/UserCasesList";
import { Metadata } from "next";
import Link from "next/link";
import { FC } from "react";

interface PageProps {}

export const metadata: Metadata = {
  title: "Cases",
  description: "An assistant to help medical students.",
};

const CasesPage: FC<PageProps> = ({}) => {
  return (
    <div className="p-8 w-full  container">
      <UserCasesList />
    </div>
  );
};

export default CasesPage;
