import CasesTabs from "@/components/cases/CasesTabs";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const BrowseCasesPage: FC<pageProps> = ({}) => {
  return (
    <div className="w-full p-8">
      <CasesTabs />
      <header className="space-y-2 my-10">
        <h1 className="text-2xl font-bold">Browse Cases</h1>
      </header>
    </div>
  );
};

export default BrowseCasesPage;
