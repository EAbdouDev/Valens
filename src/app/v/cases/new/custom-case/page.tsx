import { FC } from "react";
import PatientInformation from "../../../../../components/cases/form-steps/PatientInformation";
import CaseForm from "@/components/cases/CaseForm";
import { Button } from "@nextui-org/react";
import { Save } from "lucide-react";
import StepperSidebar from "@/components/cases/StepperSidebar";
import Header from "@/components/cases/Header";

interface pageProps {}

const NewCasePage: FC<pageProps> = ({}) => {
  return (
    <div className="min-h-full flex flex-col h-full">
      <Header caseId={null} />
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <main className="flex-1  overflow-y-auto py-6 px-10 ">
          {" "}
          <CaseForm />
        </main>

        <nav className="order-first sm:w-[25%]  overflow-y-auto p-2 border-r ">
          {" "}
          <StepperSidebar />
        </nav>
      </div>
    </div>
  );
};

export default NewCasePage;
