import { FC } from "react";
import PatientInformation from "../../../../../components/cases/form-steps/PatientInformation";
import CaseForm from "@/components/cases/CaseForm";
import { Button } from "@nextui-org/react";
import { Save } from "lucide-react";
import StepperSidebar from "@/components/cases/StepperSidebar";

interface pageProps {}

const NewCasePage: FC<pageProps> = ({}) => {
  return (
    <div className="w-full h-full ">
      <header className=" px-6 py-4 flex justify-between items-center w-full border-b">
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

      <div className="flex flex-row  h-full mt-2 p-6">
        <div className=" h-full py-6 px-8   ">
          <StepperSidebar />
        </div>
        <div className="flex-1 py-6 px-8 h-full ">
          <div className="max-w-7xl mx-auto pb-10">
            <CaseForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCasePage;
