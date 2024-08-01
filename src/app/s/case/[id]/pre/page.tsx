import { getCaseDetails } from "@/components/cases/actions";
import { Case } from "@/lib/types";
import { FC } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Header from "@/components/cases/case-sim/Header";
import Link from "next/link";

interface pageProps {
  params: {
    id: string;
  };
}

const CasePrePage: FC<pageProps> = async ({ params }) => {
  const caseDetailsDoc = await getCaseDetails(params.id);

  const caseDetails = caseDetailsDoc as Case;

  if (!caseDetails) {
    return <div>loading...</div>;
  }

  return (
    <div className="p-8">
      {/* <Header caseDetails={caseDetails} /> */}

      <div className="flex flex-col justify-center items-center flex-grow w-full h-full mt-10">
        <div className="p-4 rounded-lg shadow-md bg-white">
          <Link href={`/s/case/${params.id}`}>Start</Link>
        </div>
      </div>
    </div>
  );
};

export default CasePrePage;
