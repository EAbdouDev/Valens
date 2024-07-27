"use client";

import { FC } from "react";
import { useFormContext } from "./FormProvider";
import PatientInformation from "./form-steps/PatientInformation";
import MedicalHistory from "./form-steps/MedicalHistory";
import PresentingComplaint from "./form-steps/PresentingComplaint";
import RviewOfSystems from "./form-steps/RviewOfSystems";
import PhysicalExamination from "./form-steps/PhysicalExamination";
import DiagnosticTests from "./form-steps/DiagnosticTests";

interface CaseFormProps {}

const CaseForm: FC<CaseFormProps> = ({}) => {
  const { currentStep, formValues } = useFormContext();
  console.log(formValues);
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PatientInformation />;
      case 2:
        return <MedicalHistory />;
      case 3:
        return <PresentingComplaint />;
      case 4:
        return <RviewOfSystems />;
      case 5:
        return <PhysicalExamination />;
      case 6:
        return <DiagnosticTests />;
      default:
        return <PatientInformation />;
    }
  };

  return <div className="form-container w-full h-full">{renderStep()}</div>;
};

export default CaseForm;
