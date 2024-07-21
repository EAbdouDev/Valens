"use client";

import { FC } from "react";
import { useFormContext } from "./FormProvider";
import PatientInformation from "./form-steps/PatientInformation";
import MedicalHistory from "./form-steps/MedicalHistory";
import PresentingComplaint from "./form-steps/PresentingComplaint";
import RviewOfSystems from "./form-steps/RviewOfSystems";
import PhysicalExamination from "./form-steps/PhysicalExamination";
import DiagnosticTests from "./form-steps/DiagnosticTests";

interface CaseFormProps {
  caseId: string;
}

const CaseForm: FC<CaseFormProps> = ({ caseId }) => {
  const { currentStep } = useFormContext();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PatientInformation caseId={caseId} />;
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
        return <PatientInformation caseId={caseId} />;
    }
  };

  return <div className="form-container">{renderStep()}</div>;
};

export default CaseForm;