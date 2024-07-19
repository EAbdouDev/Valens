import { FC } from "react";
import PatientInformation from "../../../../../components/cases/form-steps/PatientInformation";
import CaseForm from "@/components/cases/CaseForm";
import { Button } from "@nextui-org/react";
import { Save } from "lucide-react";
import StepperSidebar from "@/components/cases/StepperSidebar";

interface pageProps {
  params: {
    id: string;
  };
}

const NewCasePage: FC<pageProps> = ({ params }) => {
  return (
    <div className="w-full h-full p-4">
      <header className=" px-6 py-4 flex justify-between items-center w-full  bg-gray-100 rounded-2xl">
        <div>
          <p>Untitled case</p>
        </div>
        <div>
          <Button
            className="flex justify-center items-center gap-2"
            variant="solid"
            color="primary"
          >
            <Save className="w-5 h-5" />
            Save
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-5 h-full mt-2">
        <div className="col-span-1  h-full py-6 px-8 ">
          <StepperSidebar />
        </div>
        <div className="col-span-4 py-6 px-8 h-full ">
          <div className="max-w-5xl mx-auto pb-10">
            <CaseForm caseId={params.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCasePage;
